import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {

  type = input<1 | 2>();
  swap = input<boolean>();
  shadow = input<boolean>(false);
  outline = input<'single' | 'double'>();

  tabindex = input(0);

  @HostBinding('tabindex') get hb1() {
    return this.tabindex();
  }

  click1 = output<MouseEvent>();

  protected typeClass = computed(() =>
    'type-' + (this.swap() ? 'swap-' : '') + this.type());

  protected outlineClass = computed(() => 'outline-' + this.outline());

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.return', ['$event'])
  onClick(event: MouseEvent) {
    this.click1.emit(event);
  }

}
