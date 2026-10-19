import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { sum } from '@app/common';
import { Clicker } from '@app/page/mode-presentation/service/clicker';
import { PresenterNotesData } from '@app/page/presenter-notes';
import { DeepLearningCompressionComponent } from './deep-learning-compression/deep-learning-compression.component';
import { PredictiveTextGeneratorPaneComponent } from './predictive-text-generator-pane/predictive-text-generator-pane.component';

let sectionOffsets = [0, 7];//, 7];
let maxStep = sum(sectionOffsets) - 1;

@Component({
    selector: 'app-slide-ai-and-compression',
    imports: [
        PredictiveTextGeneratorPaneComponent,
        DeepLearningCompressionComponent,
    ],
    templateUrl: './slide-ai-and-compression.component.html',
    styleUrl: './slide-ai-and-compression.component.scss'
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

    inject(Clicker).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(newAction => actionStepMap.get(newAction)?.());

    let presenterNotesService = inject(PresenterNotesData);
    effect(() => presenterNotesService.setSlide(7, this.step()));
  }

}
