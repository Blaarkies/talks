import { Route } from '@angular/router';

export const slideRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
};

export const routes: Route[] = [
  {
    path: slideRouteNames.compression,
    loadComponent: () => import( '../talk/compress/slideshow-compression/slideshow-compression.component')
      .then(c => c.SlideshowCompressionComponent),
    loadChildren: () => import( '../talk/compress/slideshow-compression/route')
      .then(c => c.routes),
  },
  // {
  //   path: routeNames.imageProcessing,
  //   loadComponent: () => import( '../talk/compress/text-entropy-measure/text-entropy-measure.component')
  //     .then(c => c.TextEntropyMeasureComponent),
  // },
];