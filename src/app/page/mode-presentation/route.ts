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
      talkRoutes: compressionSlideRouteNames,
      headingFootingMap: compressionHeadingFootingMap,
    },
  },

  {
    path: slideRouteNames.regex,
    loadChildren: () => import( '@app/page/talk/regex/route-venue-matcher')
      .then(c => c.routes),
  },
];