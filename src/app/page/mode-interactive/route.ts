import { Route } from '@angular/router';

export const sandboxRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
  regex: 'regex',
};

export const routes: Route[] = [
  {
    path: sandboxRouteNames.compression,
    loadComponent: () => import( '../talk/compress/sandbox-compression/sandbox-compression.component'),
  },
  {
    path: sandboxRouteNames.regex,
    loadComponent: () => import( '../talk/regex/sandbox-regex/sandbox-regex'),
  },
];