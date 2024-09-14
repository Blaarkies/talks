import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';

let timings = `.7s`;
let timingFunction = ` steps(4)`;

export const animateSlideOut =
  trigger('animateSlideOut', [
    transition(':enter', [
      style({translate: '200%'}),
      animate(timings + ' .2s' + timingFunction, style({translate: '0'})),
    ]),

    transition(':leave', [
      style({translate: '0', position: 'absolute'}),
      animate(timings + timingFunction, style({translate: '-100%'})),
    ]),
  ]);