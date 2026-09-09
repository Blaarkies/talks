import { Route } from '@angular/router';
import { compressionHeadingFootingMap } from '@app/page/talk/compress/heading-footing';
import { compressionSlideRouteNames } from '@app/page/talk/compress/route';

export const slideRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
  regex: 'regex',
};

export const routes: Route[] = [
  {
    path: slideRouteNames.compression,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow'),
    loadChildren: () => import( '../talk/compress/route')
      .then(c => c.routes),
    data: {
      // TODO: test if presenter notes still function after removing talkRoutes
      talkRoutes: compressionSlideRouteNames,
      headingFootingMap: compressionHeadingFootingMap,
    },
  },

  {
    path: slideRouteNames.regex,
    loadChildren: () => import( '@talk/regex/route/route-venue-matcher'),
  },
];