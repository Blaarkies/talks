import { Route } from '@angular/router';
import { regexHeadingFootingMap } from '@talk/regex/heading-footing';
import { regexSlideRouteNames } from '@talk/regex/route';
import {
  regexSlideRouteFrontmaniaNames,
  regexSlideRouteNoLogoSlides,
} from '@talk/regex/route-frontmania';

export const regexVenues = {
  default: '',
  frontmania: 'frontmania',
  devday: 'devday',
};

export const routes: Route[] = [
  {
    path: regexVenues.frontmania,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '@app/page/talk/regex/route-frontmania')
      .then(c => c.routes),
    data: {
      talkRoutes: regexSlideRouteFrontmaniaNames,
      headingFootingMap: regexHeadingFootingMap,
      logo: {
        src: 'talk/regex/venue/frontmania/logo.webp',
        style: {
          right: '75px',
          top: '60px',
          height: '175px'
        },
        hideOnRoutes: regexSlideRouteNoLogoSlides,
      }
    },
  },

  {
    path: regexVenues.devday,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '@app/page/talk/regex/route')
      .then(c => c.routes),
    data: {
      talkRoutes: regexSlideRouteNames,
      headingFootingMap: regexHeadingFootingMap,
      logo: {
        src: 'talk/regex/venue/devday/logo.webp',
        style: {
          right: '75px',
          top: '60px',
          height: '175px'
        },
        hideOnRoutes: regexSlideRouteNoLogoSlides,
      }
    },
  },

  {
    path: regexVenues.default,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '@app/page/talk/regex/route')
      .then(c => c.routes),
    data: {
      talkRoutes: regexSlideRouteNames,
      headingFootingMap: regexHeadingFootingMap,
    },
  },

  {
    path: '**',
    redirectTo: regexVenues.default,
    data: undefined, // satisfy `r.data` typing
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));