import { SharedResizeObserver } from '@angular/cdk/observers/private';
import {
  inject,
  InjectionToken,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  concatMap,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  of,
  startWith,
  timer,
} from 'rxjs';

export const SHARED_RESIZE_OBSERVER = new InjectionToken(
  'Shared Resize Observer',
  {
    providedIn: 'root',
    factory: () => new SharedResizeObserver(),
  },
);

export const WINDOW_INNER_HEIGHT$ = new InjectionToken(
  'Observable that emits each distinct innerHeight change of window',
  {
    providedIn: 'root',
    factory: () => {
      const waWindow = inject(WA_WINDOW);

      return fromEvent(waWindow, 'resize').pipe(
        map(() => waWindow.innerHeight),
        distinctUntilChanged(),
        startWith(waWindow.innerHeight),
      );
    },
  },
);

export const WINDOW_INNER_HEIGHT_RESIZED = new InjectionToken(
  'Signal that switches ON&OFF once when window inner height changes',
  {
    providedIn: 'root',
    factory: () => {
      const innerHeight$ = inject(WINDOW_INNER_HEIGHT$);

      const resize$ = innerHeight$.pipe(
        concatMap(() => merge(
          timer(0).pipe(map(() => false)),
          of(true),
        )),
        startWith(false),
      );

      return toSignal(resize$);
    },
  },
);
