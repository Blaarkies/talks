import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { PaneWindows31Component } from '../../../../../common/component/pane-windows-3-1/pane-windows-3-1.component';

@Component({
  selector: 'app-slide-other-algorithms',
  standalone: true,
  imports: [
    PaneWindows31Component,
    NgOptimizedImage,
  ],
  templateUrl: './slide-other-algorithms.component.html',
  styleUrl: './slide-other-algorithms.component.scss',
})
export class SlideOtherAlgorithmsComponent {

  protected pixelateFactor = signal(8);
  protected dragBoundaryElement = computed(() =>
    this.self.nativeElement.parentElement);

  private self = inject(ElementRef<HTMLElement>);

}
