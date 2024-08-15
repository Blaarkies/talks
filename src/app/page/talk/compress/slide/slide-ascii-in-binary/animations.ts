import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

let steps = 15;
let timings = [steps / 10 + 's', `steps(${steps})`];
let timing = timings.join(' ');
let delayedTiming = [timings[0], '.1s', timings[1]].join(' ');

let clipFull = {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'};
let clipBottom = {clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'};
let clipTop = {clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'};

export const lineRevealOnStep =
  trigger('lineRevealOnStep', [
    transition(':increment, :decrement', [
      group([
        query(':leave', [
          style(clipFull),
          animate(timing, style(clipBottom)),
        ], {optional: true}),
        query(':enter', [
          style(clipTop),
          animate(delayedTiming, style(clipFull)),
        ], {optional: true}),
      ]),
    ]),
  ]);