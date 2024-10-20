import {
  CdkMenu,
  CdkMenuBar,
  CdkMenuItem,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { routeNames } from '../../../bootstrap/app.routes';
import { ButtonComponent } from '../../common/component/button/button.component';
import { PaneComponent } from '../../common/component/pane/pane.component';
import { RimComponent } from '../../common/component/rim/rim.component';
import { makeScreenSelectorSignal } from '../../common/function/screen-size';
import {
  FontSizeService,
  SlideMode,
} from '../mode-presentation/service/font-size.service';
import { PresenterNotesService } from '../presenter-notes';
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
    ButtonComponent,
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
  protected isQuit = signal(false);

  private fontSizeService = inject(FontSizeService);
  protected mode = this.fontSizeService.slideMode;

  private menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  private router = inject(Router);

  constructor() {
    this.fontSizeService.updateFontSize();
    let presenterNotesService = inject(PresenterNotesService);
    presenterNotesService.setSlide(null, 0);
  }

  protected selectNext(step: number) {
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

  protected setSlideMode(mode: SlideMode) {
    this.fontSizeService.setSlideMode(mode);
    this.fontSizeService.updateFontSize();
  }

  @HostListener('window:keydown', ['$event'])
  private menuShortcut(event: KeyboardEvent) {
    if (!event.altKey) {
      if (event.ctrlKey && event.key === 'q') {
        this.isQuit.update(v => !v);
      }
      return;
    }

    if (event.key === 'o') {
      this.menuButton().nativeElement.click();
    }

    if (event.key === 'i') {
      this.setSlideMode(SlideMode.interactive);
    }

    if (event.key === 'p') {
      this.setSlideMode(SlideMode.presentation);
    }
  }
}
