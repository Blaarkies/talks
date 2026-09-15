import { Route } from '@angular/router';
import { mapNeighborData } from '@app/common/function/route';
import {
  slideDefinitions,
  slideRoutePaths,
} from '@talk/regex/route/slide-definition';

export const devdayNoLogoSlides = [
  slideRoutePaths.opening,
  // slideRoutePaths.introduction,
  // slideRoutePaths.closing,
];

const style: Partial<CSSStyleDeclaration> = {
  background: 'radial-gradient(circle, #000 60%, #484)',
};
const devdaySlideDefinitions = {
  opening: {
    path: slideRoutePaths.opening,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/slide-image'),
    data: {style, imageSource: 'talk/regex/venue/devday/logo.webp'},
  } as Route,
};

const routes: Route[] = [
  devdaySlideDefinitions.opening,

  slideDefinitions.teaser,
  slideDefinitions.history,
  slideDefinitions.basics,
  slideDefinitions.groups,
  slideDefinitions.wildcards,
  slideDefinitions.flags,
  slideDefinitions.pitfalls,
  slideDefinitions.readingRegex,

  slideDefinitions.end,

  {path: '**', redirectTo: slideRoutePaths.opening},
];
const withNeighborData = mapNeighborData(routes);

export default withNeighborData;