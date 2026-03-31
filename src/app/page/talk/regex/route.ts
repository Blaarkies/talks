import { Route } from '@angular/router';

export const regexSlideRouteNames = {
  teaser: 'regex-intro',
};

export const routes: Route[] = [
  {
    path: regexSlideRouteNames.teaser,
    loadComponent: () => import( '@talk/regex/slide/teaser/slide-teaser')
      .then(c => c.SlideTeaser),
  },

  {
    path: '**',
    redirectTo: regexSlideRouteNames.teaser,
    data: undefined, // satisfy `r.data` typing
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));