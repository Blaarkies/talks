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
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  coerceBetween,
  SHARED_RESIZE_OBSERVER,
} from '@app/common';
import { RimComponent } from '@app/common/component/rim/rim.component';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { routeAnimations } from '@app/page/mode-presentation/component/slideshow/route-animations';
import {
  combineLatest,
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-slideshow',
  imports: [
    RouterOutlet,
    RimComponent,
  ],
  templateUrl: './slideshow.html',
  styleUrl: './slideshow.scss',
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Slideshow {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sharedResizeObserver = inject(SHARED_RESIZE_OBSERVER);

  /** Provided by route `data` */
  talkRoutes = input.required<Record<string, string>>();
  headingFootingMap = input.required<Map<string, string[]>>();
  logo = input<{src: string, style: {}, hideOnRoutes: string[]}>();

  private routes = computed(() => Object.values(this.talkRoutes()));
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
    map(() => this.activatedRoute.firstChild.snapshot.url.at(-1).path),
  );
  private currentRouteSlideSignal = toSignal(this.currentRouteSlide$);
  protected logoVisible = computed(() => {
    const hideOnRoutes = this.logo()?.hideOnRoutes;
    if (!hideOnRoutes) return true;

    return !hideOnRoutes.includes(this.currentRouteSlideSignal());
  });

  private headingFooting = computed(() => {
    const textMap = this.headingFootingMap();
    const path = this.currentRouteSlideSignal();
    const noHeadingFooting = !textMap || !textMap.has(path);
    return noHeadingFooting ? [path, path] : textMap.get(path);
  });

  protected header = computed(() => this.headingFooting()[0] || ' ');
  protected footer = computed(() => this.headingFooting()[1] || ' ');

  constructor() {
    const routeIndexSetter$ = toObservable(this.talkRoutes).pipe(
      map(routes => {
        const firstPath = this.activatedRoute.firstChild
          .snapshot.url.at(-1).path;
        const routeValues = Object.values(routes);
        const index = routeValues.findIndex(path => path === firstPath);
        this.currentRouteIndex.set(index);

        const routesMaxIndex = routeValues.length - 1;
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
    const newRoute = this.routes()[index];
    this.router.navigate([newRoute], {relativeTo: this.activatedRoute});
  }

}
