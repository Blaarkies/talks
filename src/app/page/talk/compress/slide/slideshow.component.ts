import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  filter,
  map,
  startWith,
} from 'rxjs';
import { coerceBetween } from '../../../../common';
import { RimComponent } from '../../../../common/component/rim/rim.component';
import { ClickerService } from '../../../mode-presentation/service/clicker.service';
import { pathToHeadingFootingMap } from '../data/heading-footing';
import { compressionSlideRouteNames } from './route';

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [
    RouterOutlet,
    RimComponent,
  ],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowComponent {

  private clickerService = inject(ClickerService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private routes = Object.values(compressionSlideRouteNames);
  private currentRouteIndex: number;

  private headingFooting = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(0),
    map(() => this.activatedRoute.firstChild.snapshot.url.at(-1).path),
    map(path => pathToHeadingFootingMap.get(path) ?? path),
  ));

  protected header = computed(() => this.headingFooting()[0]);
  protected footer = computed(() => this.headingFooting()[1]);

  constructor() {
    let firstPath = this.activatedRoute.firstChild.snapshot.url.at(-1).path;
    this.currentRouteIndex = this.routes.findIndex(path => path === firstPath);
    let routesMaxIndex = this.routes.length - 1;
    let getSafeValue =
      (value: number) => coerceBetween(value, 0, routesMaxIndex);

    this.clickerService.navigateAction$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(newAction => {
      if (newAction === 'forward') {
        this.currentRouteIndex = getSafeValue(this.currentRouteIndex + 1);
        this.goToRouteIndex(this.currentRouteIndex);
      }

      if (newAction === 'backward') {
        this.currentRouteIndex = getSafeValue(this.currentRouteIndex - 1);
        this.goToRouteIndex(this.currentRouteIndex);
      }
    });
  }

  private goToRouteIndex(index: number) {
    let newRoute = this.routes[index];
    this.router.navigate([newRoute], {relativeTo: this.activatedRoute});
  }

}
