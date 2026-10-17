import { Route } from '@angular/router';
import { mapNeighborData } from '@app/common/function/route';
import { SlideImageData } from '@app/page/mode-presentation/component/slide-image/c';
import {
  slideDefinitions,
  slideRoutePaths,
} from '@talk/regex/route/slide-definition';

export const engineersWeekNoLogoSlides = [
  slideRoutePaths.opening,
];

const style: Partial<CSSStyleDeclaration> = {
  background: '#020060',
};
const engineersWeekSlideDefinitions = {
  opening: {
    path: slideRoutePaths.opening,
    loadComponent: () => import('@app/page/mode-presentation/component/slide-image/c'),
    data: <SlideImageData>{
      slideName: 'opening',
      imageSource: 'talk/regex/venue/engineers-week/opening.webp',
      style,
    },
  } as Route,
};

const routes: Route[] = [
  engineersWeekSlideDefinitions.opening,

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