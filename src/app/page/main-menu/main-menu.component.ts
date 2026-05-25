import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { routeNames } from '@app/bootstrap/routes';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { RimComponent } from '@app/common/component/rim/rim.component';
import { TaskbarMenu } from '@app/page/main-menu/component/taskbar-menu/taskbar-menu';
import { HotkeyLabel } from '@app/page/main-menu/component/taskbar-menu/type';
import { WA_WINDOW } from '@ng-web-apis/common';
import { fromEvent } from 'rxjs';
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
  imports: [
    RouterLink,
    PaneComponent,
    RimComponent,
    TaskbarMenu,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {

  private fontSizeService = inject(FontSizeService);
  protected mode = this.fontSizeService.slideMode;

  private router = inject(Router);

  protected routeNames = routeNames;
  protected slideMode = SlideMode;
  protected navigations = signal(navigationOptions);
  protected navigationsList = computed(() => Object.values(this.navigations()));
  protected selectedOption = signal<NavigationOption>(null);
  protected isQuit = signal(false);
  protected optionsMenu = computed(() => {
    const p = this.mode() === SlideMode.presentation;

    let presentation: HotkeyLabel = [' Presentation', 1];
    let interactive: HotkeyLabel = [' Interactive', 1];

    if (p) {
      const [s, i] = presentation;
      presentation = ['▸' + s.slice(1), i];
    } else {
      const [s, i] = interactive;
      interactive = ['▸' + s.slice(1), i];
    }

    return {
      title: <HotkeyLabel>['Options', 0],
      items: <HotkeyLabel[]>[
        presentation,
        interactive,
        [' Quit', 1],
      ],
    };
  });

  constructor() {
    this.fontSizeService.updateFontSize();
    let presenterNotesService = inject(PresenterNotesService);
    presenterNotesService.setSlide(null, 0);

    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.menuShortcut(event));
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

  protected menuShortcut(event: KeyboardEvent) {
    if (!event.altKey) {
      if (event.ctrlKey && event.key === 'q') {
        this.isQuit.update(v => !v);
      }
      return;
    }
  }

  protected optionsMenuClick(index: number) {
    switch (index) {
      case 0:
        this.setSlideMode(SlideMode.presentation);
        break;
      case 1:
        this.setSlideMode(SlideMode.interactive);
        break;
      case 2:
        this.isQuit.update(v => !v);
        break;
      default:
        throw new Error(`Menu option index [${index}] is not recognized`);
    }
  }

}
