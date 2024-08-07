import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { coerceBetween } from '../../../../../common';
import { ProgressComponent } from '../../../../../common/component/progress/progress.component';
import { AnimationJob } from '../../common';
import { EntropyPreviewComponent } from '../../component/entropy-preview/entropy-preview.component';
import {
  entropyTextHigh,
  entropyTextLow,
  entropyTextMid,
} from '../../data/entropy-example';

@Component({
  selector: 'app-slide-explain-entropy',
  standalone: true,
  imports: [
    EntropyPreviewComponent,
    ProgressComponent,
  ],
  templateUrl: './slide-explain-entropy.component.html',
  styleUrl: './slide-explain-entropy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideExplainEntropyComponent {


  entropyTextLow = signal(entropyTextLow);
  entropyTextMid = signal(entropyTextMid);
  entropyTextHigh = signal(entropyTextHigh);

  pane1 = viewChild('pane1', {read: ElementRef});
  pane2 = viewChild('pane2', {read: ElementRef});
  pane3 = viewChild('pane3', {read: ElementRef});

  private animationIndex = signal(0);
  private animationSteps: AnimationJob[][] = [
    [
      {ref: this.pane2, job: {translate: [0], scale: [1], width: '100%'}},
    ],
    [
      {ref: this.pane1, job: {translate: ['-50vw']}},
      {ref: this.pane2, job: {translate: [0], scale: [2]}},
    ],
    [
      {ref: this.pane1, job: {translate: ['12vw'], scale: [1]}},
      {ref: this.pane2, job: {translate: ['18vw'], scale: [1], width: '100%'}},
      {ref: this.pane3, job: {translate: ['50vw'], scale: [1]}},
    ],
    [
      {ref: this.pane1, job: {translate: ['5vw'], scale: [1.5]}},
      {ref: this.pane2, job: {translate: ['10vw'], width: '0%'}},
      {ref: this.pane3, job: {translate: ['-5vw'], scale: [1.5]}},
    ],
  ];

  private animationStep = computed(() =>
    this.animationSteps[this.animationIndex()]);

  constructor() {
    // TODO: use clicker server provided by PresentationComponent
    window.addEventListener('keydown', e => {
      let k = e.key;
      if (k === 'ArrowRight') {
        this.animationIndex.update(v => coerceBetween(v + 1, 0, this.animationSteps.length - 1));
      } else if (k === 'ArrowLeft') {
        this.animationIndex.update(v => coerceBetween(v - 1, 0, this.animationSteps.length - 1));
      }
    });
    // TODO END

    effect(() => {
      let animationJobs = this.animationStep();
      if (!animationJobs) {
        return;
      }

      let stepCount = 3;
      let options = {
        duration: stepCount * 100,
        easing: `steps(${stepCount})`,
        fill: 'both',
        step: .5,
      };

      animationJobs.forEach(j => j.ref().nativeElement
        .animate(j.job, options));
    });
  }

}
