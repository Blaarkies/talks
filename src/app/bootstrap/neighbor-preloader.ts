import {
  PreloadingStrategy,
  Route,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';

/**
 * Loads adjacent routes so that route animations function correctly.
 */
export class NeighborPreloader implements PreloadingStrategy {

  private router = inject(Router);

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    let siblings: Route[] = route.data?.siblings;
    if (!siblings) {
      return of(null);
    }

    let selfIndex = siblings.findIndex(r => r.path === route.path);
    let neighbors = siblings
      .slice(Math.max(selfIndex - 1, 0), selfIndex + 2)
      .filter(s => s.path !== route.path);

    let url = this.router.url;
    if (neighbors.every(n => !url.includes(n.path))) {
      return of(null);
    }

    return load();
  }

}