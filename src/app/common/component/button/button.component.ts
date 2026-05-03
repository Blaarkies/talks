import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  filter,
  fromEvent,
} from 'rxjs';
import { ThemeNumberAny } from '../pane/pane.component';

@Component({
  selector: 'app-button',
  imports: [
    NgClass,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    tabindex: 'tabindex',
  },
})
export class ButtonComponent {

  type = input<ThemeNumberAny>();
  swap = input<boolean>();
  shadow = input<boolean>(false);
  outline = input<'single' | 'double'>();
  tabindex = input(0);

  click1 = output<MouseEvent | KeyboardEvent>();

  protected typeClass = computed(() => {
    let type = this.type();
    if (!type) {
      return '';
    }
    let swap = this.swap() ? 'swap-' : '';
    return 'type-' + swap + type;
  });

  protected outlineClass = computed(() => {
    let outline = this.outline();
    if (!outline) {
      return '';
    }
    return 'outline-' + outline;
  });

  constructor() {
    fromEvent<KeyboardEvent>(inject(ElementRef).nativeElement, 'keydown')
      .pipe(
        filter(e => e.key === 'Enter' || e.key === 'Return'),
        takeUntilDestroyed())
      .subscribe(event => this.click1.emit(event));
  }

  protected onClick(event: PointerEvent) {
    this.click1.emit(event);
  }

}
