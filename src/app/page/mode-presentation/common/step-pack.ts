import {
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';

type OobFn = (i: number) => -1 | 0 | 1

export class StepPack {

  private step: WritableSignal<number>;

  get index(): Signal<ReturnType<typeof this.step>> {
    return this.step.asReadonly();
  }

  constructor(
    private max: number,
    private min = 0,
    startAt = min,
  ) {
    this.step = signal(startAt);
  }

  wouldBeOob(direction: -1 | 1): ReturnType<OobFn> {
    const step = direction + this.step();
    return step < this.min
           ? -1
           : step > this.max
             ? 1 : 0;
  }

  commit(direction: -1 | 1) {
    this.step.update(v => v + direction);
  }
}