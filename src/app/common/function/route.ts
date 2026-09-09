import { Route } from '@angular/router';

export function mapNeighborData(list: Route[]): Route[] {
  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
  return list.map((r, i, self) => {
    if (typeof r !== 'object') return r;

    return r.data
           ? ({...r, data: {...r.data, siblings: self}})
           : ({...r, data: {siblings: self}});
  });
}