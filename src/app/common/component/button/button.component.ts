import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';
import { ThemeNumberAny } from '../pane/pane.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {

  type = input<ThemeNumberAny>();
  swap = input<boolean>();
  shadow = input<boolean>(false);
  outline = input<'single' | 'double'>();

  tabindex = input(0);

  @HostBinding('tabindex') get hb1() {
    return this.tabindex();
  }

  click1 = output<MouseEvent>();

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

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.return', ['$event'])
  onClick(event: MouseEvent) {
    this.click1.emit(event);
  }

}
