import { Route } from '@angular/router';

export const compressionSlideRouteNames = {
  teaser: 'compression-should-be-impossible',
  entropy: 'data-vs-information',
  runLengthEncoding: 'run-length-encoding',
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
    path: compressionSlideRouteNames.runLengthEncoding,
    loadComponent: () => import( '../slide/slide-run-length-encoding/slide-run-length-encoding.component')
      .then(c => c.SlideRunLengthEncodingComponent),
  },

  {
    path: '**',
    redirectTo: compressionSlideRouteNames.teaser,
  },
];