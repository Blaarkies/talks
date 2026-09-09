import { Route } from '@angular/router';
import { mapNeighborData } from '@app/common/function/route';
import {
  slideDefinitions,
  slideRoutePaths,
} from '@talk/regex/route/slide-definition';

export const frontmaniaNoLogoSlides = [
  slideRoutePaths.opening,
  slideRoutePaths.introduction,
  slideRoutePaths.closing,
];

const frontmaniaSlideDefinitions = {
  opening: {
    path: slideRoutePaths.opening,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/slide-image'),
    data: {imageSource: 'talk/regex/venue/frontmania/opening.webp'},
  } as Route,

  introduction: {
    path: slideRoutePaths.introduction,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/slide-image'),
    data: {imageSource: 'talk/regex/venue/frontmania/introduction.webp'},
  } as Route,

  closing: {
    path: slideRoutePaths.closing,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/slide-image'),
    data: {imageSource: 'talk/regex/venue/frontmania/closing.webp'},
  } as Route,
};

const routes: Route[] = [
  frontmaniaSlideDefinitions.opening,
  frontmaniaSlideDefinitions.introduction,

  slideDefinitions.teaser,
  slideDefinitions.history,
  slideDefinitions.basics,
  slideDefinitions.groups,
  slideDefinitions.wildcards,
  slideDefinitions.flags,
  slideDefinitions.pitfalls,
  slideDefinitions.readingRegex,

  slideDefinitions.end,

  frontmaniaSlideDefinitions.closing,

  {path: '**', redirectTo: slideRoutePaths.opening},
];

const withNeighborData = mapNeighborData(routes);

export default withNeighborData;