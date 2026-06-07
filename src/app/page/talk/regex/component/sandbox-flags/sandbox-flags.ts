import {
  CdkMenuBar,
  CdkMenuItem,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import {
  outputFromObservable,
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Checkbox } from '@talk/regex/component/checkbox/checkbox';
import {
  fromEvent,
  map,
  mergeAll,
  scan,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  throttleTime,
  timer,
} from 'rxjs';

type Flag = {
  value: string
  default: boolean
  label: string
  description: string
}

@Component({
  selector: 'app-sandbox-flags',
  imports: [
    CdkMenuBar,
    CdkMenuItem,
    Checkbox,
    CdkMenuTrigger,
    ReactiveFormsModule,
  ],
  templateUrl: './sandbox-flags.html',
  styleUrl: './sandbox-flags.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxFlags {

  private dr = inject(DestroyRef);
  private stopClose$ = new Subject<void>();

  flags = input.required<Flag[]>();

  protected flagsWithControl = computed(() => this.flags().map(data => ({
    ...data,
    control: new FormControl(data.default),
  })));
  private flagChanges$ = toObservable(this.flagsWithControl).pipe(
    switchMap(flags => flags.map(flag =>
      flag.control.valueChanges.pipe(
        startWith(flag.control.value),
        map(active => ({flag, active}))))),
    mergeAll(),
  );
  private activeFlags$ = this.flagChanges$.pipe(
    scan((set, c) => {
      const newSet = new Set(set);
      if (c.active) {
        newSet.add(c.flag);
      } else {
        newSet.delete(c.flag);
      }
      return newSet;
    }, new Set<Flag>()));

  activeFlags = outputFromObservable(this.activeFlags$);

  constructor() {
    this.dr.onDestroy(() => {
      this.stopClose$.complete();
    });
  }

  protected delayClose(ref: CdkMenuTrigger, dropdown: HTMLDivElement) {
    this.stopClose$.next();

    const panel = dropdown.parentElement;
    fromEvent(panel, 'pointermove').pipe(
      throttleTime(50),
      startWith(0),
      switchMap(() => timer(500)),
      take(1),
      takeUntil(this.stopClose$),
      takeUntilDestroyed(this.dr))
      .subscribe(() => ref.close());
  }

}
