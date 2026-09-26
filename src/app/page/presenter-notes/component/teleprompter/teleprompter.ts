import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  Signal,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  filter,
  map,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  timer,
  withLatestFrom,
} from 'rxjs';

type ControlledStep = {
  text: string
  state: 'active' | 'next' | 'old'
  active: boolean
  expectedSeconds: number
}

@Component({
  selector: 'app-teleprompter',
  imports: [],
  templateUrl: './teleprompter.html',
  styleUrl: './teleprompter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Teleprompter {

  slide = input.required<string[]>();
  step = input.required<number>();
  fontSize = input.required<number>();

  private charReadSpeakSpeed = signal(15);

  private scrollerView = viewChild('scroller', {read: ElementRef<HTMLElement>});
  private scroller = computed<HTMLElement>(() =>
    this.scrollerView().nativeElement);

  private notesViews = viewChildren('note', {read: ElementRef<HTMLElement>});
  private notes = computed<HTMLElement[]>(() =>
    Array.from(this.notesViews().map(e => e.nativeElement).values()));

  protected scrollPosition: Signal<string>;

  constructor() {
    const screenHeight = inject(WA_WINDOW).innerHeight;
    const stop$ = new Subject<void>();
    inject(DestroyRef).onDestroy(() => stop$.complete());

    const measuredElements$ = toObservable(this.notes);
    const step$ = toObservable(this.step);
    const position$ = step$.pipe(
      withLatestFrom(measuredElements$),
      filter(([, m]) => !!m?.length),
      switchMap(([i, m]) => {
        stop$.next();

        const active = m[i];
        const initial = active.offsetTop;
        const next = initial + active.offsetHeight
          - screenHeight + this.scroller().offsetTop
          + 120;

        if (active.offsetHeight < screenHeight) return of(initial);

        const measure = this.controlledSteps()[i];
        const timeMs = measure.expectedSeconds * 1e3;

        return timer(timeMs).pipe(
          map(() => next),
          startWith(initial),
          takeUntil(stop$),
        );
      }),
      map(v => `0 -${v}px`),
    );

    this.scrollPosition = toSignal(position$);
  }

  protected controlledSteps = computed(() => {
    const steps = this.slide();
    const currentIndex = this.step();
    const charReadSpeakSpeed = this.charReadSpeakSpeed();

    return steps.map((text, i) => {
      const totalSeconds = text.length / charReadSpeakSpeed;
      const expectedSeconds = totalSeconds / 2;
      return {
        text,
        state: i < currentIndex
               ? 'old' : i === currentIndex
                         ? 'active' : 'next',
        active: i === currentIndex,
        expectedSeconds,
      } as ControlledStep;
    });
  });


}
