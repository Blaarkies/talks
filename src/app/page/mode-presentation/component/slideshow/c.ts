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
import { Clicker } from '@app/page/mode-presentation/service/clicker';
import { SlideDeck } from '@app/page/mode-presentation/service/slide-deck';
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
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Slideshow {

  private sharedResizeObserver = inject(SHARED_RESIZE_OBSERVER);
  private currentRouteSlideSignal = inject(SlideDeck).currentRouteSlide;

  /** Provided by route `data` */
  headingFootingMap = input.required<Map<string, string[]>>();
  logo = input<VenueLogo>();

  private headerElement = viewChild('headingElement',
    {read: ElementRef<HTMLDivElement>});

  rimHeaderHeight = toSignal(
    toObservable(this.headerElement).pipe(
      switchMap(e => this.sharedResizeObserver
        .observe(e.nativeElement.parentElement)),
      map(([e]) => e.target.clientHeight),
      startWith(34)));

  protected animateBusy = signal(false);

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
    // ActivatedRoute is determined by injection context.
    // It MUST use this one, that is relative to the slideshow in router-outlet
    inject(SlideDeck).setActivatedRoute(inject(ActivatedRoute));
  }

}
