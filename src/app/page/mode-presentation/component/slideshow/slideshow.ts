import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  coerceBetween,
  SHARED_RESIZE_OBSERVER,
} from '@app/common';
import { RimComponent } from '@app/common/component/rim/rim.component';
import { VenueLogo } from '@app/page/mode-presentation/component/slideshow/type';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
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

@Component({
  selector: 'app-slideshow',
  imports: [
    RouterOutlet,
    RimComponent,
  ],
  templateUrl: './slideshow.html',
  styleUrl: './slideshow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Slideshow {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sharedResizeObserver = inject(SHARED_RESIZE_OBSERVER);

  /** Provided by route `data` */
  headingFootingMap = input.required<Map<string, string[]>>();
  logo = input<VenueLogo>();

  private routePaths$ = this.getSlideRoutePaths$();
  private routePaths = toSignal(this.routePaths$);
  private headerElement = viewChild('headingElement',
    {read: ElementRef<HTMLDivElement>});

  rimHeaderHeight = toSignal(
    toObservable(this.headerElement).pipe(
      switchMap(e => this.sharedResizeObserver
        .observe(e.nativeElement.parentElement)),
      map(([e]) => e.target.clientHeight),
      startWith(34)));

  protected animateBusy = signal(false);
  protected currentRouteIndex = signal(-1);

  private currentRouteSlide$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(0),
    map(() => this.activatedRoute.firstChild?.snapshot.url.at(-1).path),
  );
  private currentRouteSlideSignal = toSignal(this.currentRouteSlide$);

  protected logoVisible = computed(() => {
    const hideOnRoutes = this.logo()?.hideOnRoutes;
    if (!hideOnRoutes) return true;

    return !hideOnRoutes.includes(this.currentRouteSlideSignal());
  });

  protected headingFooting = computed(() => {
    const textMap = this.headingFootingMap();
    const path = this.currentRouteSlideSignal();
    const noHeadingFooting = !textMap || !textMap.has(path);
    const result = noHeadingFooting
                   ? [path, path]
                   : textMap.get(path);

    return result
           ? {header: result[0], footer: result[1]}
           : {};
  });

  constructor() {
    const routeIndexSetter$ = this.routePaths$.pipe(
      withLatestFrom(this.currentRouteSlide$),
      map(([routePaths, slidePath]) => {
        const index = routePaths.findIndex(p => p === slidePath);
        this.currentRouteIndex.set(index);

        const routesMaxIndex = routePaths.length - 1;
        return (value: number) => coerceBetween(value, 0, routesMaxIndex);
      }),
    );

    combineLatest({
      action: inject(ClickerService).navigateAction$,
      getRouteSafeValue: routeIndexSetter$,
    }).pipe(takeUntilDestroyed())
      .subscribe(({action, getRouteSafeValue}) => {
        const offset = action === 'forward' ? 1 : -1;
        this.currentRouteIndex.update(v => getRouteSafeValue(v + offset));
        this.goToRouteIndex(this.currentRouteIndex());
      });
  }

  private goToRouteIndex(index: number) {
    const newRoute = this.routePaths()[index];
    this.router.navigate([newRoute], {relativeTo: this.activatedRoute});
  }

  private getSlideRoutePaths$(): Observable<string[]> {
    const lazyResult = this.activatedRoute.routeConfig.loadChildren();
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
