import { Route } from '@angular/router';

export const regexSlideRouteNames = {
  teaser: 'intro',
  history: 'history',
  basics: 'my-first-match',
  groups: 'groups-and-capturing',
  wildcards: 'wildcard-selectors',
  flags: 'modifier-flags',
  pitfall: 'pitfalls',
  cheatSheet: 'cheat-sheet',
  end: 'end-and-questions',
};

export const routes: Route[] = [
  {
    path: regexSlideRouteNames.teaser,
    loadComponent: () => import('@talk/regex/slide/teaser/teaser'),
  },
  {
    path: regexSlideRouteNames.history,
    loadComponent: () => import('@talk/regex/slide/history/history'),
  },
  {
    path: regexSlideRouteNames.basics,
    loadComponent: () => import('@talk/regex/slide/basic-matching/basic-matching'),
  },
  {
    path: regexSlideRouteNames.groups,
    loadComponent: () => import('@talk/regex/slide/capture-group/capture-group'),
  },
  {
    path: regexSlideRouteNames.wildcards,
    loadComponent: () => import('@talk/regex/slide/wildcard/wildcard'),
  },
  {
    path: regexSlideRouteNames.flags,
    loadComponent: () => import('@talk/regex/slide/flag/flag'),
  },
  {
    path: regexSlideRouteNames.pitfall,
    loadComponent: () => import('@talk/regex/slide/pitfall/pitfall'),
  },

  {
    path: regexSlideRouteNames.cheatSheet,
    loadComponent: () => import('@talk/regex/slide/cheat-sheet/cheat-sheet'),
  },

  {
    path: regexSlideRouteNames.end,
    loadComponent: () => import( '@app/page/mode-presentation/component/slide-end/slide-end'),
    data: {qrData: 'blaarkies-talks.pages.dev/interactive/regex'},
  },

  {
    path: '**',
    redirectTo: regexSlideRouteNames.teaser,
    data: undefined, // satisfy `r.data` typing
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));