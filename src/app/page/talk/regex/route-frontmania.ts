import { Route } from '@angular/router';

export const regexSlideRouteFrontmaniaNames = {
  opening: 'opening',
  introduction: 'introduction',
  teaser: 'intro',
  history: 'history',
  basics: 'my-first-match',
  groups: 'groups-and-capturing',
  wildcards: 'wildcard-selectors',
  flags: 'modifier-flags',
  pitfalls: 'pit-falls',
  readingRegex: 'reading-regex',
  end: 'end-and-questions',
  closing: 'closing',
};

export const regexSlideRouteNoLogoSlides = [
  regexSlideRouteFrontmaniaNames.opening,
  regexSlideRouteFrontmaniaNames.introduction,
  regexSlideRouteFrontmaniaNames.closing,
];

export const routes: Route[] = [
  {
    path: regexSlideRouteFrontmaniaNames.opening,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/slide-image'),
    data: {imageSource: 'talk/regex/venue/frontmania/opening.webp'},
  },
  {
    path: regexSlideRouteFrontmaniaNames.introduction,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/slide-image'),
    data: {imageSource: 'talk/regex/venue/frontmania/introduction.webp'},
  },

  {
    path: regexSlideRouteFrontmaniaNames.teaser,
    loadComponent: () => import('@talk/regex/slide/teaser/teaser'),
  },
  {
    path: regexSlideRouteFrontmaniaNames.history,
    loadComponent: () => import('@talk/regex/slide/history/history'),
  },
  {
    path: regexSlideRouteFrontmaniaNames.basics,
    loadComponent: () => import('@talk/regex/slide/basic-matching/basic-matching'),
  },
  {
    path: regexSlideRouteFrontmaniaNames.groups,
    loadComponent: () => import('@talk/regex/slide/capture-group/capture-group'),
  },
  {
    path: regexSlideRouteFrontmaniaNames.wildcards,
    loadComponent: () => import('@talk/regex/slide/wildcard/wildcard'),
  },
  {
    path: regexSlideRouteFrontmaniaNames.flags,
    loadComponent: () => import('@talk/regex/slide/flag/flag'),
  },
  {
    path: regexSlideRouteFrontmaniaNames.pitfalls,
    loadComponent: () => import('@talk/regex/slide/pitfall/pitfall'),
  },
  {
    path: regexSlideRouteFrontmaniaNames.readingRegex,
    loadComponent: () => import('@talk/regex/slide/pitfall/pitfall'),
  },

  {
    path: regexSlideRouteFrontmaniaNames.end,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-end/slide-end'),
    data: {qrData: 'blaarkies-talks.pages.dev/interactive/regex'},
  },

  {
    path: regexSlideRouteFrontmaniaNames.closing,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/slide-image'),
    data: {imageSource: 'talk/regex/venue/frontmania/closing.webp'},
  },


  {
    path: '**',
    redirectTo: regexSlideRouteFrontmaniaNames.opening,
    data: undefined, // satisfy `r.data` typing
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));