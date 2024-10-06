import {
  CdkMenu,
  CdkMenuBar,
  CdkMenuItem,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { routeNames } from '../../../bootstrap/app.routes';
import { PaneComponent } from '../../common/component/pane/pane.component';
import { RimComponent } from '../../common/component/rim/rim.component';
import { makeScreenSelectorSignal } from '../../common/function/screen-size';
import {
  FontSizeService,
  SlideMode,
} from '../mode-presentation/service/font-size.service';
import {
  NavigationOption,
  navigationOptions,
} from './data/navigation-options';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    RouterLink,
    PaneComponent,
    RimComponent,
    CdkMenuTrigger,
    CdkMenuBar,
    CdkMenuItem,
    CdkMenu,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {

  protected routeNames = routeNames;
  protected slideMode = SlideMode;
  protected navigations = signal(navigationOptions);
  protected navigationsList = computed(() => Object.values(this.navigations()));
  protected selectedOption = signal<NavigationOption>(null);
  protected isMobile = makeScreenSelectorSignal();

  private fontSizeService = inject(FontSizeService);
  protected mode = this.fontSizeService.slideMode;

  private router = inject(Router);

  constructor() {
    this.fontSizeService.updateFontSize();
  }

  selectNext(step: number) {
    let list = this.navigationsList();
    let index = list.indexOf(this.selectedOption());
    if (index === -1) {
      return this.selectedOption.set(list[0]);
    }

    index = (index + step) % list.length;
    index = index > -1 ? index : list.length - 1;

    this.selectedOption.set(list[index]);
  }

  async launchSelected() {
    let url = this.selectedOption()?.url;
    if (!url) {
      return;
    }
    await this.router.navigate(['../', routeNames.present, url]);
  }

  setSlideMode(mode: SlideMode) {
    this.fontSizeService.setSlideMode(mode);
    this.fontSizeService.updateFontSize();
  }
}
