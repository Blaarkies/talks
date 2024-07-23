import { Route } from '@angular/router';

export const slideRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
};

export const routes: Route[] = [
  {
    path: slideRouteNames.compression,
    loadComponent: () => import( '../talk/compress/slide/slideshow.component')
      .then(c => c.SlideshowComponent),
    loadChildren: () => import( '../talk/compress/slide/route')
      .then(c => c.routes),
  },
  // {
  //   path: routeNames.imageProcessing,
  //   loadComponent: () => import( '../talk/compress/text-entropy-measure/text-entropy-measure.component')
  //     .then(c => c.TextEntropyMeasureComponent),
  // },
];