import { Route } from '@angular/router';

export const compressionSlideRouteNames = {
  teaser: 'compression-should-be-impossible',
  entropy: 'data-vs-information',
};

export const routes: Route[] = [
  {
    path: compressionSlideRouteNames.teaser,
    loadComponent: () => import( '../slide/slide-teaser/slide-teaser.component')
      .then(c => c.SlideTeaserComponent),
  },
  {
    path: compressionSlideRouteNames.entropy,
    loadComponent: () => import( '../slide/slide-explain-entropy/slide-explain-entropy.component')
      .then(c => c.SlideExplainEntropyComponent),
  },

  {
    path: '**',
    redirectTo: compressionSlideRouteNames.teaser,
  },
];