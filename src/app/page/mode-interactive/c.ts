import {
  Component,
  inject,
} from '@angular/core';
import {
  Router,
  RouterOutlet,
} from '@angular/router';
import { routeNames } from '@app/bootstrap/routes';
import { RimComponent } from '@app/common/component/rim/rim.component';
import { TaskbarMenu } from '@app/page/main-menu/component/taskbar-menu/c';
import { TaskBarMenuConfig } from '@app/page/main-menu/component/taskbar-menu/type';
import {
  FontSizeService,
  SlideMode,
} from '../mode-presentation/service/font-size.service';

@Component({
  selector: 'app-mode-interactive',
  imports: [
    RouterOutlet,
    RimComponent,
    TaskbarMenu,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export default class ModeInteractiveComponent {

  private router = inject(Router);

  protected taskbar: TaskBarMenuConfig = {
    title: {
      label: 'Back',
      hotkey: 'B',
    },
    titleAction: () => void this.router.navigate(['../', routeNames.mainMenu]),
    items: [],
  };

  constructor() {
    let fontSizeService = inject(FontSizeService);
    fontSizeService.setSlideMode(SlideMode.interactive);
    fontSizeService.updateFontSize();
  }

}
