import { Route } from '@angular/router';

export const compressionSlideRouteNames = {
  entropy: 'data-vs-information',
};

export const routes: Route[] = [
  {
    path: compressionSlideRouteNames.entropy,
    loadComponent: () => import( '../slide/slide-explain-entropy/slide-explain-entropy.component')
      .then(c => c.SlideExplainEntropyComponent),
  },

  {
    path: '**',
    redirectTo: compressionSlideRouteNames.entropy,
  },
];