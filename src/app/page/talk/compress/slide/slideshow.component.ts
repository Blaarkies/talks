import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
} from '@angular/router';
import { coerceBetween } from '../../../../common';
import { ClickerService } from '../../../mode-presentation/service/clicker.service';
import { compressionSlideRouteNames } from './route';

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [
    RouterOutlet,
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

  constructor() {
    let firstPath = this.activatedRoute.firstChild.snapshot.url
      .at(-1).path;
    this.currentRouteIndex = this.routes.findIndex(path => path === firstPath);
    let routesMaxIndex = this.routes.length - 1;

    this.clickerService.navigateAction$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(newAction => {
      if (newAction === 'forward') {
        this.currentRouteIndex = coerceBetween(this.currentRouteIndex + 1, 0, routesMaxIndex);
        let nextRoute = this.routes[this.currentRouteIndex];
        this.router.navigate([nextRoute], {relativeTo: this.activatedRoute});
      }

      if (newAction === 'backward') {
        this.currentRouteIndex = coerceBetween(this.currentRouteIndex - 1, 0, routesMaxIndex);
        let previousRoute = this.routes[this.currentRouteIndex];
        this.router.navigate([previousRoute], {relativeTo: this.activatedRoute});
      }
    });
  }

}
