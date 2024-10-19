import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

let timings = `.7s`;
let timingFunction = ` steps(4)`;

export const animateHeight =
  trigger('height', [
    state('null, true', style({height: '*', overflow: 'hidden'})),
    state('void, false', style({height: 0, overflow: 'hidden'})),
    transition(':enter, * => true, :leave, * => false',
      [animate(`${timings} ${timingFunction}`)]),
  ]);
