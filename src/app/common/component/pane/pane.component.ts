import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { WA_WINDOW } from '@ng-web-apis/common';

@Component({
  selector: 'app-pane',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './pane.component.html',
  styleUrl: './pane.component.scss',
})
export class PaneComponent {

  header = input<string>();
  type = input<1 | 2 | 3 | 4>(1);
  swap = input<boolean>();
  shadow = input<boolean>(true);
  outline = input<'single' | 'double'>();
  headerPosition = input<'left'>();

  protected typeClass = computed(() =>
    'type-' + (this.swap() ? 'swap-' : '') + this.type());
  protected outlineClass = computed(() => 'outline-' + this.outline());

  // for use by parents for padding-negation
  outerPadding = computed(() => this.window
    .getComputedStyle(this.main().nativeElement)
    .getPropertyValue('--outer-padding'));

  private main = viewChild<ElementRef<HTMLDivElement>>('main');
  private window = inject(WA_WINDOW);

}
