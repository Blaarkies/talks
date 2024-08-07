import {
  effect,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { coerceBetween } from '../../../../common';
import { AnimationJob } from './type';

interface Config {
  startAt?: number;
  stepCount?: number;
  frameDuration?: number;
}

export class AnimationController {

  private index: WritableSignal<number>;
  private maxIndex: number;

  animationIndex: Signal<number>;

  constructor(private animationSteps: AnimationJob[][], config = <Config>{}) {
    if (!animationSteps.length) {
      throw new Error('No animation steps defined');
    }

    let {startAt, stepCount, frameDuration} = Object.assign(<Config>{
      startAt: 0,
      stepCount: 3,
      frameDuration: 100,
    }, config);

    this.maxIndex = this.animationSteps.length - 1;

    let options = {
      duration: stepCount * frameDuration,
      easing: `steps(${stepCount})`,
      fill: 'both',
    };

    effect(() => {
      let animationJobs = this.animationSteps[this.index()];

      animationJobs.forEach(j => {
        let extraOptions = {
          ...options,
          ...j.options,
        };
        j.ref().nativeElement.animate(j.job, extraOptions);
      });
    });

    this.index = signal(startAt);
    this.animationIndex = this.index.asReadonly();
  }

  forward() {
    this.index.update(v =>
      coerceBetween(v + 1, 0, this.maxIndex));
  }

  backward() {
    this.index.update(v =>
      coerceBetween(v - 1, 0, this.maxIndex));
  }
}