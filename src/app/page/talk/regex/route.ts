import { Route } from '@angular/router';

export const regexSlideRouteNames = {
  teaser: 'intro',
  history: 'history',
  basics: 'my-first-match',
  groups: 'groups-and-capturing',
  wildcards: 'wildcard-selectors',
  flags: 'modifier-flags',
  pitfall: 'pitfalls',
  // 3	Missing anchors	        /abc/ finds "abc" anywhere	      Add ^ and $ for exact match
  // 5	Case sensitivity	      /cat/ misses "Cat"	              Add /i flag or use [Cc]at
  // 6	Wrong character class	  [a-z] doesn't match uppercase	    Use [a-zA-Z] or [a-z]i
  // 2	Unescaped special chars	.nl matches any char + nl	        Escape: \.
  // 1	Greedy matching	        .* matches as much as possible    Use .*? for lazy matching
  // 4	Overusing .*	          .*email.* is too broad	          Be specific: \w+@\w+\.\w+
  // 8	Overengineering	        One giant pattern for everything	Split into smaller patterns
  // 7	Engine differences	    Lookbehind fails in old JS	      Test in target environment

  // cheatSheet: 'cheat-sheet',
  // end: 'end-and-questions',
};

export const routes: Route[] = [
  {
    path: regexSlideRouteNames.teaser,
    loadComponent: () => import('@talk/regex/slide/teaser/teaser')
  },
  {
    path: regexSlideRouteNames.history,
    loadComponent: () => import('@talk/regex/slide/history/history')
  },
  {
    path: regexSlideRouteNames.basics,
    loadComponent: () => import('@talk/regex/slide/basic-matching/basic-matching')
  },
  {
    path: regexSlideRouteNames.groups,
    loadComponent: () => import('@talk/regex/slide/capture-group/capture-group')
  },
  {
    path: regexSlideRouteNames.wildcards,
    loadComponent: () => import('@talk/regex/slide/wildcard/wildcard')
  },
  {
    path: regexSlideRouteNames.flags,
    loadComponent: () => import('@talk/regex/slide/flag/flag')
  },
  {
    path: regexSlideRouteNames.pitfall,
    loadComponent: () => import('@talk/regex/slide/pitfall/pitfall')
  },

  {
    path: '**',
    redirectTo: regexSlideRouteNames.teaser,
    data: undefined, // satisfy `r.data` typing
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));