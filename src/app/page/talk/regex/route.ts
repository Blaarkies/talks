import { Route } from '@angular/router';

export const regexSlideRouteNames = {
  teaser: 'intro',
  history: 'history',
  basics: 'my-first-match',
  // ctrl+f example. find integer example. find float

  groups: 'groups-and-capturing',
  // detect "n day/month/year ago". use dot*
  // escape char, tell regex to not read it literally
  // OR |

  wildcards: 'wildcard-selectors',
  // \d and \D.
  // \w \s \b
  // [a-z]
  // Quantifiers ? + * {2,} greedy

  flags: 'modifier-flags',
  // Global / Multiline / case-Insensitive
  // lookahead lookbehind + negative

  cheatSheet: 'cheat-sheet',
  end: 'end-and-questions',
};

export const routes: Route[] = [
  {
    path: regexSlideRouteNames.teaser,
    loadComponent: () => import('@talk/regex/slide/teaser/teaser')
      .then(c => c.SlideTeaser),
  },
  {
    path: regexSlideRouteNames.history,
    loadComponent: () => import('@talk/regex/slide/history/history')
      .then(c => c.SlideHistory),
  },

  {
    path: '**',
    redirectTo: regexSlideRouteNames.teaser,
    data: undefined, // satisfy `r.data` typing
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));