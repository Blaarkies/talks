import { DestroyRef } from '@angular/core';
import {
  lerp,
  makeNumberList,
  windowed,
} from '@app/common';
import {
  BehaviorSubject,
  concatMap,
  map,
  Observable,
  tap,
  timer,
} from 'rxjs';

type Config = {
  maxIndex: number
  scale?: number
  smoothness: number
  start: number
  destroyRef?: DestroyRef
}

const defaultConfig: Config = {
  scale: 200,
  smoothness: .6,
  start: 0,
  maxIndex: Number.MAX_SAFE_INTEGER,
};

/** Exposes index$ stream of incrementing numbers with value emissions
 * separated by a dynamic random time duration */
export class TempoGenerator {

  private trigger$: BehaviorSubject<number>;

  index$: Observable<number>;

  constructor(userConfig?: Partial<Config>) {
    const config: Config = Object.assign(
      {}, defaultConfig, userConfig);

    const rngList = makeNumberList(100)
      .map(n => Math.floor(((n / Math.PI) % 1) * config.scale));
    const bias = config.smoothness / 2;
    const rngSmoothList = windowed(rngList)
      .map(([a, b]) => lerp(a, b, bias));

    this.trigger$ = new BehaviorSubject(config.start);

    this.index$ = this.trigger$.pipe(
      concatMap(n => {
        const time = rngSmoothList[n % 100];
        return timer(time).pipe(map(() => n));
      }),
      tap(n => this.trigger$
        .next(++n % (config.maxIndex + 1))),
    );

    config.destroyRef?.onDestroy(() => this.dispose());
  }

  dispose() {
    this.trigger$.complete();
  }

}