import { Route } from '@angular/router';
import { mapNeighborData } from '@app/common/function/route';
import { VenueLogo } from '@app/page/mode-presentation/component/slideshow/type';
import { headingFootingMap } from '@talk/regex/route/heading-footing';
import {
  frontmaniaNoLogoSlides,
} from '@talk/regex/route/venue-frontmania';

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
    loadChildren: () => import( '@talk/regex/route/venue-frontmania'),
    data: {
      headingFootingMap: headingFootingMap,
      logo: <VenueLogo>{
        src: 'talk/regex/venue/frontmania/logo.webp',
        style: {
          right: '45px', //'75px',
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
    loadChildren: () => import( '@talk/regex/route/venue-devday'),
    data: {
      headingFootingMap: headingFootingMap,
      logo: <VenueLogo>{
        src: 'talk/regex/venue/devday/logo.webp',
        style: {
          right: '45px', //'75px',
          top: '60px',
          height: '175px',
        },
      },
    },
  },

  {
    path: regexVenues.default,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '@talk/regex/route/venue-default'),
    data: {
      headingFootingMap: headingFootingMap,
    },
  },

  {path: '**', redirectTo: regexVenues.default},
];

const withNeighborData = mapNeighborData(routes);

export default withNeighborData;