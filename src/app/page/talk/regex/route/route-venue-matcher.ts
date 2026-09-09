import { Route } from '@angular/router';
import { mapNeighborData } from '@app/common/function/route';
import { headingFootingMap } from '@talk/regex/route/heading-footing';
import {
  frontmaniaNoLogoSlides,
} from '@talk/regex/route/route-frontmania';

export const regexVenues = {
  default: '',
  frontmania: 'frontmania',
  devday: 'devday',
};

const routes: Route[] = [
  {
    path: regexVenues.frontmania,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '@talk/regex/route/route-frontmania'),
    data: {
      headingFootingMap: headingFootingMap,
      logo: {
        src: 'talk/regex/venue/frontmania/logo.webp',
        style: {
          right: '75px',
          top: '60px',
          height: '175px',
        },
        hideOnRoutes: frontmaniaNoLogoSlides,
      },
    },
  },

  {
    path: regexVenues.devday,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '@talk/regex/route/route-all'),
    data: {
      headingFootingMap: headingFootingMap,
      logo: {
        src: 'talk/regex/venue/devday/logo.webp',
        style: {
          right: '75px',
          top: '60px',
          height: '175px',
        },
        // hideOnRoutes: slideRouteNoLogoSlides,
      },
    },
  },

  {
    path: regexVenues.default,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '@talk/regex/route/route-all'),
    data: {
      headingFootingMap: headingFootingMap,
    },
  },

  {path: '**', redirectTo: regexVenues.default},
];

const withNeighborData = mapNeighborData(routes);

export default withNeighborData;