import { Route } from '@angular/router';

export const slideRoutePaths = {
  teaser: 'intro',
  history: 'history',
  basics: 'my-first-match',
  groups: 'groups-and-capturing',
  wildcards: 'wildcard-selectors',
  flags: 'modifier-flags',

  end: 'end-and-questions',

  pitfalls: 'pitfalls',
  readingRegex: 'reading-regex',

  opening: 'opening',
  introduction: 'introduction',
  closing: 'closing',
};

type TypeLoadComponent = Route['loadComponent']
export type SlideKey = keyof typeof slideRoutePaths

const imports: [SlideKey, TypeLoadComponent][] = [
  ['teaser', () => import('@talk/regex/slide/teaser/teaser')],
  ['history', () => import('@talk/regex/slide/history/history')],
  ['basics', () => import('@talk/regex/slide/basic-matching/basic-matching')],
  ['groups', () => import('@talk/regex/slide/capture-group/capture-group')],
  ['wildcards', () => import('@talk/regex/slide/wildcard/wildcard')],
  ['flags', () => import('@talk/regex/slide/flag/flag')],
  ['pitfalls', () => import('@talk/regex/slide/pitfall/pitfall')],
  ['readingRegex', () => import('@talk/regex/slide/pitfall/pitfall')],
];

const keyRoutes = imports
  .map(([key, loadComponent]) => ({
    key,
    route: <Route>{path: slideRoutePaths[key], loadComponent},
  }))
  .concat([{
    key: 'end',
    route: {
      path: slideRoutePaths.end,
      loadComponent: () => import( '@app/page/mode-presentation/component/slide-end/slide-end'),
      data: {qrData: 'blaarkies-talks.pages.dev/interactive/regex'},
    },
  }]);

export const slideDefinitions = Object.fromEntries(
  keyRoutes.map(r => [r.key, r.route])) as Record<SlideKey, Route>;
