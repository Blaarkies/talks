import { Route } from '@angular/router';

export const sandboxRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
};

export const routes: Route[] = [
  {
    path: sandboxRouteNames.compression,
    loadComponent: () => import( '../talk/compress/text-entropy-measure/text-entropy-measure.component')
      .then(c => c.TextEntropyMeasureComponent),
  },
];