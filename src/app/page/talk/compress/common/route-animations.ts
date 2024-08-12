import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

const hostStyle = style({
  position: 'relative',
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
});

const defaultAnimation = query(':enter, :leave',
  [style({
    zIndex: -1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  })],
  {optional: true},
);

let timings = '1s steps(10)';

export const routeAnimations =
  trigger('routeAnimations', [
    transition(':increment', [
      hostStyle,
      defaultAnimation,
      query(':enter', [style({left: '100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate(timings, style({left: '-100%'}))],
          {optional: true}),
        query(':enter', [animate(timings, style({left: '0%'}))],
          {optional: true}),
        query('@*', animateChild(), {optional: true}),
      ]),
    ]),

    transition(':decrement', [
      hostStyle,
      defaultAnimation,
      query(':enter', [style({left: '-100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate(timings, style({left: '100%'}))],
          {optional: true}),
        query(':enter', [animate(timings, style({left: '0%'}))],
          {optional: true}),
        query('@*', animateChild(), {optional: true}),
      ]),
    ]),
  ]);