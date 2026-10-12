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
  DestroyRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import {
  ID,
  isBetween,
} from '@app/common';
import {
  ActionItem,
  HighlightSection,
  HotkeyLabel,
  TaskBarMenuConfig,
} from '@app/page/main-menu/component/taskbar-menu/type';
import { MenuService } from '@app/page/main-menu/service/menu';
import {
  combineLatest,
  filter,
} from 'rxjs';

@Component({
  selector: 'app-taskbar-menu',
  imports: [
    CdkMenu,
    CdkMenuBar,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskbarMenu {

  private id = inject(ID).make();
  private menuService = inject(MenuService);

  config = input.required<TaskBarMenuConfig>();
  hotkeysActive = input(true);

  mainClick = output<TaskBarMenuConfig>();
  itemClick = output<ActionItem>();

  private menuTrigger = viewChild(CdkMenuTrigger);

  protected headingSections = computed(() =>
    this.convertToSections(this.config().title));

  private convertToSections(hotkeyLabel: HotkeyLabel): HighlightSection[] {
    const {label, hotkey, skip = 0} = hotkeyLabel;
    if (!label || !hotkey) {
      throw new Error(`Missing label/hotkey: label[${label}] hotkey[${hotkey}]`);
    }
    if (hotkey.length > 1) {
      throw new Error(`Hot must be only 1 character: [${hotkey}]`);
    }

    const keyMatches = label.matchAll(new RegExp(hotkey, 'g'));
    const listMatches = Array.from(keyMatches);
    if (skip >= listMatches.length) {
      throw new Error(`Skip is greater than character count`);
    }

    const index = listMatches.at(skip).index;

    if (index === 0) {
      return [
        {content: label[0], highlight: true},
        {content: label.slice(1)},
      ];
    }

    if (index === label.length - 1) {
      return [
        {content: label.slice(0, -1)},
        {content: label.at(-1), highlight: true},
      ];
    }

    if (isBetween(index, 0, label.length - 1)) {
      return [
        {content: label.slice(0, index)},
        {content: label[index], highlight: true},
        {content: label.slice(index + 1)},
      ];
    }

    throw new Error('Highlight character index must be in text');
  }

  protected itemsSectioned = computed(() => {
    const items = this.config().items ?? [];
    return items.map((item, i) => ({
      index: i,
      sections: this.convertToSections(item.hotkeyLabel),
      item,
    }));
  });

  private shortcutMain = computed(() => this.config().title.hotkey.toLowerCase());

  private shortcutsMap = computed(() => {
    const items = this.config().items ?? [];
    const hotkeyedItems = items.map(item => <[string, ActionItem]>[
      item.hotkeyLabel.hotkey.toLowerCase(), item
    ]);
    return new Map<string, ActionItem>(hotkeyedItems);
  });

  constructor() {
    combineLatest([
      toObservable(this.shortcutMain),
      toObservable(this.shortcutsMap)
    ]).subscribe(([main, items]) =>
      this.menuService.register(this.id, main, items.keys().toArray()));

    inject(DestroyRef).onDestroy(() =>
      this.menuService.deregister(this.id));

    this.menuService.menuRequest$.pipe(
      filter(({id}) => id === this.id && this.hotkeysActive()),
      takeUntilDestroyed())
      .subscribe(({key}) => this.handleShortcuts(key));
  }

  private handleShortcuts(key: string) {
    if (key === this.shortcutMain()) {
      this.menuTrigger().toggle();
      return;
    }

    if (!this.menuTrigger().isOpen()) return;

    if (key === 'escape') {
      this.menuTrigger().close();
      return;
    }

    const shortcutsMap = this.shortcutsMap();
    if (!shortcutsMap.has(key)) return;

    const item = shortcutsMap.get(key);
    this.itemClick.emit(item);
    this.menuTrigger().close();
  }
}
