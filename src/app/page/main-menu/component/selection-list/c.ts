import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  inject,
  input,
  linkedSignal,
  output,
  TemplateRef,
} from '@angular/core';
import {
  outputFromObservable,
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import {
  PaneComponent,
  ThemeNumberAny,
} from '@component/pane/pane.component';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  filter,
  fromEvent,
} from 'rxjs';

export type SelectionListOption<T = unknown> = {
  label: string
  action?: () => void
  data?: T
}

@Component({
  selector: 'app-selection-list',
  imports: [
    PaneComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionList<T> {

  header = input.required<string>();
  type = input<ThemeNumberAny>(1);
  options = input.required<SelectionListOption<T>[]>();

  protected selectedOption = linkedSignal(() => this.options()[0]);

  selectOption = outputFromObservable(toObservable(this.selectedOption));
  launch = output<SelectionListOption<T>>();
  exitFocus = output<false | SelectionListOption<T>>();

  protected itemAdaptor = contentChild(TemplateRef);

  private disabled = false;

  constructor() {
    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown').pipe(
        filter(() => !this.disabled),
        takeUntilDestroyed())
      .subscribe(e => this.handleKeyDown(e));
  }

  setDisabled(v: boolean) {
    this.disabled = v;
  }

  protected setSelection(o: SelectionListOption<T>) {
    if (this.disabled) return;

    this.selectedOption.set(o);
  }

  private selectNext(step: number) {
    if (this.disabled) return;

    const list = this.options();
    let index = list.indexOf(this.selectedOption());

    if (index === -1) return this.selectedOption.set(list[0]);

    index = (index + step) % list.length;
    index = index > -1 ? index : list.length - 1;

    this.selectedOption.set(list[index]);
  }

  private handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();

    if (e.ctrlKey && key === 'arrowright') {
      return this.launch.emit(this.selectedOption());
    }

    switch (key) {
      case 'arrowdown':
        return this.selectNext(1);
      case 'arrowup':
        return this.selectNext(-1);
      case 'arrowright':
        this.disabled = true;
        return this.exitFocus.emit(this.selectedOption());
      case 'arrowleft':
        this.disabled = false;
        return this.exitFocus.emit(false);
      case 'enter':
        return this.launch.emit(this.selectedOption());
    }
  }

}
