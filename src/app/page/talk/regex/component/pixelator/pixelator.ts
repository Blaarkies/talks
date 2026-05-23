import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceAtLeast } from '@app/common';
import { PIXELATOR_ID } from '@talk/regex/component/pixelator/token';
import {
  endWith,
  map,
  Subject,
  take,
  takeUntil,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-pixelator',
  imports: [],
  templateUrl: './pixelator.html',
  styleUrl: './pixelator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pixelator {

  private dr = inject(DestroyRef);
  protected id = inject(PIXELATOR_ID)();
  private stopAnimation$ = new Subject<void>();

  private stepSize = 2;
  private maxN = 6;
  private midN = this.maxN * .45;
  private interval = 300;
  private direction: 'out' | 'in' = 'in';
  private delay = 0;

  protected dilateRadius = signal(0);
  protected erodeRadius = signal(0);

  constructor() {
    this.dr.onDestroy(() => this.stopAnimation$.complete());
  }

  config({
           stepSize,
           maxN,
           interval,
           direction,
           delay,
         }: {
    stepSize?: typeof this.stepSize,
    maxN?: typeof this.maxN,
    interval?: typeof this.interval,
    direction?: typeof this.direction,
    delay?: typeof this.delay,
  }) {
    if (stepSize !== undefined) {
      this.stepSize = stepSize;
    }

    if (maxN !== undefined) {
      this.maxN = maxN;
      this.midN = maxN * .45;
    }

    if (interval !== undefined) {
      this.interval = interval;
    }

    if (direction !== undefined) {
      this.direction = direction;
    }

    if (delay !== undefined) {
      this.delay = delay;
    }
  }

  pixelate(config?: { immediate?: boolean }) {
    this.stopAnimation$.next();

    if (config?.immediate) {
      this.dilateRadius.set(0);
      this.erodeRadius.set(0);
      return;
    }

    const forward = this.direction === 'out';
    const timer$ = timer(this.delay, this.interval).pipe(take(this.maxN));
    const cleanTimer$ = forward
                        ? timer$.pipe(endWith(50))
                        : timer$.pipe(map(n => this.maxN - n), endWith(0));

    cleanTimer$.pipe(
      map(n => this.stepSize * n),
      takeUntil(this.stopAnimation$),
      takeUntilDestroyed(this.dr),
    ).subscribe(n => {
      const dilateR = n < this.midN ? n : this.maxN - n;
      const safeDilateR = coerceAtLeast(dilateR);

      this.dilateRadius.set(safeDilateR);
      this.erodeRadius.set(n);
    });
  }

}
