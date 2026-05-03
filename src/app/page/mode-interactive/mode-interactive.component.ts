import {
  Component,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { routeNames } from '@app/bootstrap/routes';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  filter,
  fromEvent,
} from 'rxjs';
import { RimComponent } from '../../common/component/rim/rim.component';
import {
  FontSizeService,
  SlideMode,
} from '../mode-presentation/service/font-size.service';

@Component({
  selector: 'app-mode-interactive',
  imports: [
    RouterOutlet,
    RimComponent,
    RouterLink,
  ],
  templateUrl: './mode-interactive.component.html',
  styleUrl: './mode-interactive.component.scss',
})
export class ModeInteractiveComponent {

  protected routeMainMenu = routeNames.mainMenu;

  private router = inject(Router);

  constructor() {
    let fontSizeService = inject(FontSizeService);
    fontSizeService.setSlideMode(SlideMode.interactive);
    fontSizeService.updateFontSize();

    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown')
      .pipe(
        filter(e => e.altKey && e.key === 'b'),
        takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['../', this.routeMainMenu]));
  }

}
