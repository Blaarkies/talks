import {
  CdkMenu,
  CdkMenuBar,
  CdkMenuItem,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isBetween } from '@app/common';
import {
  HighlightSection,
  HotkeyLabel,
} from '@app/page/main-menu/component/taskbar-menu/type';
import { WA_WINDOW } from '@ng-web-apis/common';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-taskbar-menu',
  imports: [
    CdkMenu,
    CdkMenuBar,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  templateUrl: './taskbar-menu.html',
  styleUrl: './taskbar-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskbarMenu {

  title = input.required<HotkeyLabel>();
  items = input.required<HotkeyLabel[]>();

  itemClick = output<number>();

  private menuTrigger = viewChild(CdkMenuTrigger);

  protected headingSections = computed<HighlightSection[]>(() => {
    const [title, i] = this.title();
    return this.convertToSections(title, i);
  });

  protected itemsSectioned = computed(() => {
    const items = this.items();
    return items.map(([text, highlightIndex], i) => ({
      index: i,
      sections: this.convertToSections(text, highlightIndex),
    }));
  });

  private shortcutMain = computed(() => {
    const [text, index] = this.title();
    return text[index].toLowerCase();
  });

  private shortcutsMap = computed(() => {
    const items = this.items();
    const keys = items.map(([text, highlightIndex]) => text[highlightIndex].toLowerCase());
    return new Map(keys.map((key, i) => [key, i]));
  });

  constructor() {
    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe(e => this.handleShortcuts(e));
  }

  private convertToSections(text: string, index: number): HighlightSection[] {
    if (index === 0) {
      return [
        {content: text[0], highlight: true},
        {content: text.slice(1)},
      ];
    }

    if (index === text.length - 1) {
      return [
        {content: text.slice(0, -1)},
        {content: text.at(-1), highlight: true},
      ];
    }

    if (isBetween(index, 0, text.length - 1)) {
      return [
        {content: text.slice(0, index)},
        {content: text[index], highlight: true},
        {content: text.slice(index + 1)},
      ];
    }

    throw new Error('Highlight character index must be in text');
  }

  private handleShortcuts(event: KeyboardEvent) {
    const key = event.key;

    if (key === this.shortcutMain()) {
      this.menuTrigger().toggle();
      return;
    }

    if (!this.menuTrigger().isOpen()) {
      return;
    }

    const shortcutsMap = this.shortcutsMap();
    if (!shortcutsMap.has(key)) {
      return;
    }

    const indexOfKey = shortcutsMap.get(key);
    this.itemClick.emit(indexOfKey);
    this.menuTrigger().close();
  }
}
