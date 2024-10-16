import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBetween } from '../../../../../common';
import { PaneWindows31Component } from '../../../../../common/component/pane-windows-3-1/pane-windows-3-1.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';

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

  constructor() {
    let presenterStep = signal(0);
    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(9, presenterStep()));
    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(a => presenterStep.update(n => {
        let difference = a === 'right' ? 1 : -1;
        return coerceBetween(n + difference, 0, 3);
      }));
  }

}
