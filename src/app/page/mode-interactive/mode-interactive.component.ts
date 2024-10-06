import {
  Component,
  HostListener,
  inject,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { routeNames } from '../../../bootstrap/app.routes';
import { ButtonComponent } from '../../common/component/button/button.component';
import { RimComponent } from '../../common/component/rim/rim.component';
import {
  FontSizeService,
  SlideMode,
} from '../mode-presentation/service/font-size.service';

@Component({
  selector: 'app-mode-interactive',
  standalone: true,
  imports: [
    RouterOutlet,
    RimComponent,
    ButtonComponent,
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
  }

  @HostListener('window:keydown.b')
  onClick() {
    this.router.navigate(['../', this.routeMainMenu]);
  }

}
