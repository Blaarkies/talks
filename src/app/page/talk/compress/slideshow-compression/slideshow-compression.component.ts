import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
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
import { routeAnimations } from '../common/route-animations';
import { pathToHeadingFootingMap } from './heading-footing';
import { compressionSlideRouteNames } from './route';

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [
    RouterOutlet,
    RimComponent,
  ],
  templateUrl: './slideshow-compression.component.html',
  styleUrl: './slideshow-compression.component.scss',
  animations: [routeAnimations],
})
export class SlideshowCompressionComponent {

  protected currentRouteIndex: WritableSignal<number>;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private routes = Object.values(compressionSlideRouteNames);

  private headingFooting = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(0),
    map(() => this.activatedRoute.firstChild.snapshot.url.at(-1).path),
    map(path => pathToHeadingFootingMap.get(path) ?? [path, path]),
  ));

  protected header = computed(() => this.headingFooting()[0] || ' ');
  protected footer = computed(() => this.headingFooting()[1] || ' ');

  constructor() {
    let firstPath = this.activatedRoute.firstChild.snapshot.url.at(-1).path;
    let index = this.routes.findIndex(path => path === firstPath);
    this.currentRouteIndex = signal(-1);
    this.currentRouteIndex = signal(index);

    let routesMaxIndex = this.routes.length - 1;
    let getSafeValue =
      (value: number) => coerceBetween(value, 0, routesMaxIndex);

    inject(ClickerService).navigateAction$.pipe(takeUntilDestroyed())
      .subscribe(newAction => {
        if (newAction === 'forward') {
          this.currentRouteIndex.update(v => getSafeValue(v + 1));
          this.goToRouteIndex(this.currentRouteIndex());
        }

        if (newAction === 'backward') {
          this.currentRouteIndex.update(v => getSafeValue(v - 1));
          this.goToRouteIndex(this.currentRouteIndex());
        }
      });
  }

  private goToRouteIndex(index: number) {
    let newRoute = this.routes[index];
    this.router.navigate([newRoute], {relativeTo: this.activatedRoute});
  }

}
