import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  coerceBetween,
  median,
  WINDOW_INNER_HEIGHT$,
} from '@app/common';
import {
  combineLatest,
  delay,
  distinctUntilChanged,
  filter,
  map,
  of,
  scan,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';

type ControlledStep = {
  text: string
  state: 'active' | 'next' | 'old'
  active: boolean
  length: number
}

type ScrollerMove = {
  value: string
  type: 'slow-pan' | 'snap'
  timeMs: number
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

  private initialSpeed = 15;
  private stepIndex$ = toObservable(this.step);
  private reader$ = toObservable(this.slide).pipe(
    switchMap(steps =>
      // inner pipe for scan's initial value
      this.stepIndex$.pipe(
        scan((acc, i) => {
          const now = Date.now();
          const difference = (now - acc.timestamp) / 1e3;
          return {
            timestamp: now,
            speed: acc.length / difference,
            length: steps[i].length,
          };
        }, {
          timestamp: Date.now() - (steps[0].length / this.initialSpeed) * 1e3,
          speed: this.initialSpeed,
          length: steps[0].length,
        }),
      ),
    ),
    scan((acc, v) => acc.slice(-2).concat([v.speed]), <number[]>[]),
    map(list => {
      const currentSpeed = median(list);
      const safeSpeed = coerceBetween(currentSpeed, 15, 40);
      return Math.round(safeSpeed);
    }),
    distinctUntilChanged(),
  );

  private charSpeakSpeed = toSignal(this.reader$,
    {initialValue: this.initialSpeed});

  private scrollerView = viewChild('scroller', {read: ElementRef<HTMLElement>});
  private scrollerElement = computed<HTMLElement>(() =>
    this.scrollerView().nativeElement);

  private notesViews = viewChildren('note', {read: ElementRef<HTMLElement>});
  private notesElements = computed<HTMLElement[]>(() =>
    Array.from(this.notesViews().map(e => e.nativeElement).values()));

  protected controlledSteps = computed(() => {
    const currentIndex = this.step();
    return this.slide().map((text, i) => ({
        text,
        state: i < currentIndex
               ? 'old' : i === currentIndex
                         ? 'active' : 'next',
        active: i === currentIndex,
        length: text.length,
      } as ControlledStep));
  });

  constructor() {
    const stop$ = new Subject<void>();
    inject(DestroyRef).onDestroy(() => stop$.complete());

    const elementMeasures$ = toObservable(this.notesElements).pipe(
      // element size changes immediately after constructions
      delay(0),
      map(list => list.map(e => ({
        top: e.offsetTop,
        height: e.offsetHeight,
      }))));
    const scrollerWithFontSize$ = toObservable(this.scrollerElement).pipe(
      delay(0),
      map(element => ({
        element,
        emToPx: parseFloat(
          getComputedStyle(element.querySelector('.note')).fontSize),
        top: element.offsetTop,
      })));
    combineLatest([
      elementMeasures$,
      toObservable(this.step),
      scrollerWithFontSize$,
      inject(WINDOW_INNER_HEIGHT$),
      toObservable(this.charSpeakSpeed),
    ]).pipe(
      filter(([elements]) => !!elements?.length),
      switchMap(([elements, i, scroller, screenHeight, speed]) => {
        stop$.next();

        const topBuffer = scroller.top;
        const availableHeight = screenHeight - topBuffer;

        const active = elements[i];
        const initial = active.top;

        const next = initial
          + active.height - availableHeight
          + scroller.emToPx * 2;
        if (active.height < availableHeight) {
          return of({value: `0 ${-initial}px`, type: 'snap'});
        }

        const measure = this.controlledSteps()[i];
        const timeMs = 1e3 * measure.length / speed;

        return timer(timeMs / 2).pipe(
          map(() => ({value: next, type: 'slow-pan'})),
          startWith(({value: initial, type: 'snap'})),
          map(({value, type}) => ({value: `0 ${-value}px`, type, timeMs})),
          takeUntil(stop$),
        );
      }),
      scan((acc, v) => [acc?.[1], v], <ScrollerMove[]>[]),
      withLatestFrom(toObservable(this.scrollerElement)),
      tap(([, scroller]) => scroller.getAnimations().forEach(a => a.finish())),
      delay(0),
      takeUntilDestroyed(),
    ).subscribe(([move, scroller]) => {
      const [oldMove, newMove] = <ScrollerMove[]>move;

      const isSnap = newMove.type === 'snap';
      scroller.animate({
        translate: [oldMove?.value ?? '', newMove.value],
      }, {
        fill: 'both',
        duration: isSnap ? .5e3 : newMove.timeMs / 3,
        easing: isSnap ? 'ease-out' : 'cubic-bezier(0.5, 0, 0.5, 1)',
      });
    });
  }


}
