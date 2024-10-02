import { Route } from '@angular/router';

export const sandboxRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
};

export const routes: Route[] = [
  {
    path: sandboxRouteNames.compression,
    loadComponent: () => import( '../talk/compress/sandbox-compression/sandbox-compression.component')
      .then(c => c.SandboxCompressionComponent),
  },
];