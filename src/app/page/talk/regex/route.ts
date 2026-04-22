import { Route } from '@angular/router';

export const regexSlideRouteNames = {
  teaser: 'intro',
  // add hieroglyphics joke

  history: 'history',
  //

  basics: 'my-first-match',
  // ctrl+f example. find integer example. find float

  groups: 'groups-and-capturing',
  // detect "n day/month/year ago". use dot*
  // escape char, tell regex to not read it literally
  // OR |
  // Non-capturing groups (?: )

  wildcards: 'wildcard-selectors',
  // \d and \D.
  // \w \s \b
  // [a-z]
  // Quantifiers ? + * {2,} greedy

  flags: 'modifier-flags',
  // Global / Multiline / case-Insensitive
  // lookahead lookbehind + negative

  pitfall: 'pitfalls',
  // 3	Missing anchors	        /abc/ finds "abc" anywhere	      Add ^ and $ for exact match
  // 5	Case sensitivity	      /cat/ misses "Cat"	              Add /i flag or use [Cc]at
  // 6	Wrong character class	  [a-z] doesn't match uppercase	    Use [a-zA-Z] or [a-z]i
  // 2	Unescaped special chars	.nl matches any char + nl	        Escape: \.
  // 1	Greedy matching	        .* matches as much as possible    Use .*? for lazy matching
  // 4	Overusing .*	          .*email.* is too broad	          Be specific: \w+@\w+\.\w+
  // 8	Overengineering	        One giant pattern for everything	Split into smaller patterns
  // 7	Engine differences	    Lookbehind fails in old JS	      Test in target environment

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
    path: regexSlideRouteNames.basics,
    loadComponent: () => import('@talk/regex/slide/basic-matching/basic-matching')
      .then(c => c.BasicMatching),
  },
  {
    path: 'test',
    loadComponent: () => import('@talk/regex/slide/history/film-shot/modern-regex/modern-regex')
      .then(c => c.ModernRegex),
    data: {},
  },

  {
    path: '**',
    redirectTo: regexSlideRouteNames.teaser,
    data: undefined, // satisfy `r.data` typing
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));