import { Route } from '@angular/router';
import { compressionHeadingFootingMap } from '@app/page/talk/compress/heading-footing';
import { compressionSlideRouteNames } from '@app/page/talk/compress/route';
import { regexHeadingFootingMap } from '@app/page/talk/regex/heading-footing';
import { regexSlideRouteNames } from '@app/page/talk/regex/route';

export const slideRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
  regex: 'regex',
};

export const routes: Route[] = [
  {
    path: slideRouteNames.compression,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow')
        .then(c => c.Slideshow),
    loadChildren: () => import( '../talk/compress/route')
      .then(c => c.routes),
    data: {
      talkRoutes: compressionSlideRouteNames,
      headingFootingMap: compressionHeadingFootingMap,
    },
  },
  {
    path: slideRouteNames.regex,
    loadComponent:
      () => import('@app/page/mode-presentation/component/slideshow/slideshow')
        .then(c => c.Slideshow),
    loadChildren: () => import( '@app/page/talk/regex/route')
      .then(c => c.routes),
    data: {
      talkRoutes: regexSlideRouteNames,
      headingFootingMap: regexHeadingFootingMap,
    },
  },
  // {
  //   path: routeNames.imageProcessing,
  //   loadComponent: () => import( '../talk/compress/text-entropy-measure/text-entropy-measure.component')
  //     .then(c => c.TextEntropyMeasureComponent),
  // },
];