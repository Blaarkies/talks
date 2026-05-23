import {
  inject,
  Injectable,
  Injector,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { coerceBetween } from '@app/common';
import {
  Observable,
  scan,
  startWith,
  Subject,
} from 'rxjs';

@Injectable()
export class ClickerService {

  private injector = inject(Injector);

  navigateAction$ = new Subject<'forward' | 'backward'>();
  stepAction$ = new Subject<'right' | 'left'>();

  constructor() {
  }

  forward() {
    this.navigateAction$.next('forward');
  }

  backward() {
    this.navigateAction$.next('backward');
  }

  right() {
    this.stepAction$.next('right');
  }

  left() {
    this.stepAction$.next('left');
  }

  makeSafeStepperObservable(max: number, min = 0): Observable<number> {
    return this.stepAction$.pipe(
      startWith(null),
      scan((acc, value) => {
        const asNumber = value === 'left'
                         ? -1 : value === 'right'
                                ? 1 : 0;
        const safeStep = coerceBetween(asNumber + acc, min, max);
        return safeStep;
      }, min));
  }

  makeSafeStepperSignal(max: number, min = 0): Signal<number> {
    return toSignal(this.makeSafeStepperObservable(max, min),
      {injector: this.injector},
    );
  }

  autoStep(count: number) {
    if (!count) {
      return;
    }

    const repeat = Math.abs(count);
    const right = Math.sign(count) > 0;

    for (let i = 0; i < repeat; i++) {
      right ? this.right() : this.left();
    }
  }

}
