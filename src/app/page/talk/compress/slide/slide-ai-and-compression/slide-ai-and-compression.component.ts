import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  coerceBetween,
  sum,
} from '../../../../../common';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';
import { DeepLearningCompressionComponent } from './deep-learning-compression/deep-learning-compression.component';
import { PredictiveTextGeneratorPaneComponent } from './predictive-text-generator-pane/predictive-text-generator-pane.component';

let sectionOffsets = [0, 7, 7];
let maxStep = sum(sectionOffsets);

@Component({
  selector: 'app-slide-ai-and-compression',
  standalone: true,
  imports: [
    PaneComponent,
    NgTemplateOutlet,
    PredictiveTextGeneratorPaneComponent,
    DeepLearningCompressionComponent,
  ],
  templateUrl: './slide-ai-and-compression.component.html',
  styleUrl: './slide-ai-and-compression.component.scss',
})
export class SlideAiAndCompressionComponent {

  protected step = signal(0);
  protected sectionToShow = computed(() =>
    this.step() < this.sectionOffsets[1] ? 1 : 2);
  protected sectionOffsets = sectionOffsets;

  constructor() {
    let actionStepMap = new Map<string, () => void>([
      ['right', () => this.step.update(v => Math.min(++v, maxStep))],
      ['left', () => this.step.update(v => Math.max(--v, 0))],
    ]);

    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(newAction => actionStepMap.get(newAction)?.());

    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(7, this.step()));
  }

}
