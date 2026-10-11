import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { routeNames } from '@app/bootstrap/routes';
import { RimComponent } from '@app/common/component/rim/rim.component';
import { DescriptionList } from '@app/page/main-menu/component/description-list/c';
import { MainSelector } from '@app/page/main-menu/component/main-selector/c';
import { SelectionListOption } from '@app/page/main-menu/component/selection-list/c';
import { TaskbarMenu } from '@app/page/main-menu/component/taskbar-menu/c';
import {
  ActionItem,
  HotkeyLabel,
} from '@app/page/main-menu/component/taskbar-menu/type';
import { VenueSelector } from '@app/page/main-menu/component/venue-selector/c';
import { WA_WINDOW } from '@ng-web-apis/common';
import { fromEvent } from 'rxjs';
import {
  FontSizeService,
  SlideMode,
} from '../mode-presentation/service/font-size.service';
import { PresenterNotesService } from '../presenter-notes';
import {
  NavigationOption,
  VenueSelection,
} from './data/navigation-options';

@Component({
  selector: 'app-main-menu',
  imports: [
    RimComponent,
    TaskbarMenu,
    MainSelector,
    DescriptionList,
    VenueSelector,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export default class MainMenu {

  private fontSizeService = inject(FontSizeService);
  protected mode = this.fontSizeService.slideMode;

  private router = inject(Router);
  private window = inject(WA_WINDOW);

  protected selectedOption = signal<SelectionListOption<NavigationOption>>(null);
  protected venueSelections = signal<VenueSelection[]>(null);
  protected isQuit = signal(false);

  protected modeMenu = computed(() => {
    const p = this.mode() === SlideMode.presentation;

    const presentation: HotkeyLabel = {
      label: (p ? '▸' : ' ') + 'Presentation',
      hotkey: 'P'
    };
    const interactive: HotkeyLabel = {
      label: (!p ? '▸' : ' ') + 'Interactive',
      hotkey: 'I',
    };

    return {
      title: <HotkeyLabel>{
        label: ' Options',
        hotkey: 'O',
      },
      items: <ActionItem[]>[
        {
          hotkeyLabel: presentation,
          action: () => this.setSlideMode(SlideMode.presentation),
        },
        {
          hotkeyLabel: interactive,
          action: () => this.setSlideMode(SlideMode.interactive),
        },
        {
          hotkeyLabel: {label: ' Quit', hotkey: 'Q'},
          action: () => this.isQuit.update(v => !v),
        },
      ],
    };
  });

  protected notesMenu = computed(() => {
    if (this.mode() !== SlideMode.presentation) return;

    return {
      title: <HotkeyLabel>{
        label: 'Notes',
        hotkey: 'N',
      },
      items: <ActionItem[]>[
        {
          hotkeyLabel: {
            label: 'Start',
            hotkey: 'S',
          },
          action: () => this.navigateToUrl(routeNames.presenterNotes, true),
        },
      ],
    };
  });

  protected aboutMenu = {
    title: <HotkeyLabel>{
      label: 'About',
      hotkey: 'A',
    },
    items: <ActionItem[]>[
      {
        hotkeyLabel: {
          label: 'Source Code',
          hotkey: 'C',
        },
        action: () =>
          this.navigateToUrl('https://github.com/Blaarkies/talks', true),
      },
      {
        hotkeyLabel: {
          label: 'Blaarkies Hub',
          hotkey: 'B',
        },
        action: () => this.navigateToUrl('https://blaarkies.com', true),
      },
    ],
  };

  constructor() {
    this.fontSizeService.updateFontSize();
    let presenterNotesService = inject(PresenterNotesService);
    presenterNotesService.setSlide(null, 0);

    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.menuShortcut(event));
  }

  protected setSlideMode(mode: SlideMode) {
    this.fontSizeService.setSlideMode(mode);
    this.fontSizeService.updateFontSize();
  }

  private menuShortcut(event: KeyboardEvent) {
    if (event.altKey) return;

    if (event.ctrlKey && event.key === 'q') {
      return this.isQuit.update(v => !v);
    }

    if (this.isQuit()) return this.isQuit.update(v => !v);
  }

  protected navigateToUrl(url: string, external = false) {
    if (external) {
      this.window.open(url, '_blank');
      return;
    }
    void this.router.navigate([url], {});
  }

}
