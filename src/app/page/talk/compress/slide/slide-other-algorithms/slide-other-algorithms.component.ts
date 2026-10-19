import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBetween } from '@app/common';
import { PaneWindows31Component } from '@component/pane-windows-3-1/pane-windows-3-1.component';
import { Clicker } from '@app/page/mode-presentation/service/clicker';
import { PresenterNotesData } from '@app/page/presenter-notes';

@Component({
    selector: 'app-slide-other-algorithms',
    imports: [
        PaneWindows31Component,
    ],
    templateUrl: './slide-other-algorithms.component.html',
    styleUrl: './slide-other-algorithms.component.scss'
})
export class SlideOtherAlgorithmsComponent {

  protected pixelateFactor = signal(8);
  protected dragBoundaryElement = computed(() =>
    this.self.nativeElement.parentElement);

  private self = inject(ElementRef<HTMLElement>);

  constructor() {
    let presenterStep = signal(0);
    let presenterNotesService = inject(PresenterNotesData);
    effect(() => presenterNotesService.setSlide(9, presenterStep()));
    inject(Clicker).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(a => presenterStep.update(n => {
        let difference = a === 'right' ? 1 : -1;
        return coerceBetween(n + difference, 0, 3);
      }));
  }

}
