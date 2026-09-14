import { Route } from '@angular/router';
import { mapNeighborData } from '@app/common/function/route';
import {
  slideDefinitions,
} from '@talk/regex/route/slide-definition';

const routes: Route[] = [
  slideDefinitions.teaser,
  slideDefinitions.history,
  slideDefinitions.basics,
  slideDefinitions.groups,
  slideDefinitions.wildcards,
  slideDefinitions.flags,
  slideDefinitions.pitfalls,
  slideDefinitions.readingRegex,

  slideDefinitions.end,

  {path: '**', redirectTo: slideDefinitions.teaser.path},
];
const withNeighborData = mapNeighborData(routes);

export default withNeighborData;