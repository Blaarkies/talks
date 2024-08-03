import { Route } from '@angular/router';

export const sandboxRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
};

export const routes: Route[] = [
  {
    path: sandboxRouteNames.compression,
    loadComponent: () => import( '../talk/compress/component/entropy-preview/entropy-preview.component')
      .then(c => c.EntropyPreviewComponent),
  },
];