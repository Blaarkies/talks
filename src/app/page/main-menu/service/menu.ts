import {
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { unique } from '@app/common';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  fromEvent,
  Subject,
} from 'rxjs';

type Origin = {
  id: number
  main?: boolean
}

type MenuRequest = Origin & { key: string }

@Injectable({providedIn: 'root'})
export class MenuService {

  private shortcuts = new Map<string, Origin>();
  private origins: number[] = [];

  menuRequest$ = new Subject<MenuRequest>();

  constructor() {
    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe(e => this.handleShortcut(e));

    inject(DestroyRef).onDestroy(() => this.menuRequest$.complete());
  }

  register(id: number, main: string, items: string[]) {
    const keys = [main].concat(items);
    const conflicts = keys.filter(k => this.shortcuts.has(k));
    if (conflicts.length) {
      // throw new Error(`Menu key conflicts: [${keys.join()}]`);
      console.error(`Menu key conflicts: [${keys.join()}]`);
    }

    this.shortcuts.set(main, {id, main: true});
    items.forEach(h => this.shortcuts.set(h, {id}));

    const ids = this.shortcuts.values().map(({id}) => id).toArray();
    this.origins = unique(ids);
  }

  deregister(id: number) {
    const otherEntries = this.shortcuts.entries()
      .filter(([,v]) => v.id !== id);
    this.shortcuts = new Map(otherEntries);
    this.origins = this.origins.filter(oid => id !== oid);
  }

  private handleShortcut(event: KeyboardEvent) {
    const hotkey = event.key.toLowerCase();

    if (hotkey === 'escape') {
      this.origins
        .forEach(id => this.menuRequest$.next({id, key: 'escape'}));
      return;
    }

    const shortcuts = this.shortcuts;
    if (!shortcuts.has(hotkey)) return;

    const origin = shortcuts.get(hotkey);

    this.menuRequest$.next({...origin, key: hotkey});

    if (origin.main) {
      this.origins
        .filter(id => id !== origin.id)
        .forEach(id => this.menuRequest$.next({id, key: 'escape'}));
      return;
    }
  }

}
