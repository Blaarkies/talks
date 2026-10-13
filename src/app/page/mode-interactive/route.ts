import { Route } from '@angular/router';

export const sandboxRouteNames = {
  compression: 'compression',
  imageProcessing: 'image-processing',
  regex: 'regex',
};

const routes: Route[] = [
  {
    path: sandboxRouteNames.compression,
    loadComponent: () => import( '../talk/compress/sandbox/c'),
  },
  {
    path: sandboxRouteNames.regex,
    loadComponent: () => import( '@talk/regex/sandbox/c'),
  },
];

export default routes;