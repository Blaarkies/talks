import {
  inject,
  linkedSignal,
  Service,
  signal,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
} from '@angular/router';
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Service({autoProvided: false})
export class SlideDeck {

  private router = inject(Router);

  private activatedRoute = signal<undefined | ActivatedRoute>(undefined);
  private activatedRoute$ = toObservable(this.activatedRoute);

  private routePaths$ = this.activatedRoute$.pipe(
    filter(ar => !!ar),
    switchMap(() => this.getSlideRoutePaths$()));
  private routePaths = toSignal(this.routePaths$);

  private currentRouteSlide$ = combineLatest([
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(0)),
    this.activatedRoute$,
  ]).pipe(
    map(([e, ar]) => ar?.firstChild?.snapshot?.url.at(-1).path),
  );

  currentRouteSlide = toSignal(this.currentRouteSlide$);

  private indexFromUrl$ = this.routePaths$.pipe(
    withLatestFrom(this.currentRouteSlide$),
    map(([routePaths, slidePath]) => routePaths.findIndex(p => p === slidePath)),
  );
  private indexFromUrl = toSignal(this.indexFromUrl$, {initialValue: -1});
  private currentRouteIndex = linkedSignal(() => this.indexFromUrl());

  setActivatedRoute(activatedRoute: ActivatedRoute) {
    this.activatedRoute.set(activatedRoute);
  }

  slideBack(): boolean {
    if (!this.canSlideBack()) return false;

    this.currentRouteIndex.update(v => v - 1);
    this.goToRouteIndex(this.currentRouteIndex());
    return true;
  }

  slideNext(): boolean {
    if (!this.canSlideNext()) return false;

    this.currentRouteIndex.update(v => v + 1);
    this.goToRouteIndex(this.currentRouteIndex());
    return true;
  }

  canSlideBack() {
    return this.canSlide(-1);
  }

  canSlideNext() {
    return this.canSlide(1);
  }

  private canSlide(direction: -1 | 1): boolean {
    const index = this.currentRouteIndex() + direction;
    const can = this.routePaths()[index];
    return !!can;
  }

  private goToRouteIndex(index: number) {
    const newRoute = this.routePaths()[index];
    this.router.navigate([newRoute], {relativeTo: this.activatedRoute()});
  }

  private getSlideRoutePaths$(): Observable<string[]> {
    const lazyResult = this.activatedRoute().routeConfig.loadChildren();
    if (lazyResult instanceof Promise) {
      return fromPromise(lazyResult).pipe(
        map((m: { default: Route[] } | Route[]) => {
          const list = ('default' in m) ? m.default : m;
          return list
            .slice(0, -1) // ignore the catch-all route "path: '**'"
            .map(r => r.path);
        }),
      );
    } else {
      // Don't throw exception. You can still wing a buggy slideshow on stage.
      // But a fatal exception exit won't let you present further.
      console.error('Cannot index routes', lazyResult);
      return of([]);
    }
  }

}
