import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  interval,
  map,
  take,
  tap,
  timer,
} from 'rxjs';
import {
  coerceBetween,
  makeLoremIpsum,
  makeNumberList,
} from '../../../../../common';
import { AnimationStep } from '../../common';
import { EntropyMeasureComponent } from '../../component/entropy-measure/entropy-measure.component';
import { ProgressComponent } from '../../../../../common/component/progress/progress.component';

@Component({
  selector: 'app-slide-explain-entropy',
  standalone: true,
  imports: [
    EntropyMeasureComponent,
    ProgressComponent,
  ],
  templateUrl: './slide-explain-entropy.component.html',
  styleUrl: './slide-explain-entropy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideExplainEntropyComponent {

  loremsEasy = signal(makeNumberList(15)
    .reduce((sum, n) => sum + sum.split(' ')
        .slice(0, n).join(' ') + ' ',
      makeLoremIpsum(5))
    .substring(0, 300));

  loremsMid = signal(makeLoremIpsum(50).substring(0, 300));

  loremsMaxed = signal(
    makeLoremIpsum(150).split(' ')
      .filter((w, i, self) => i === self.indexOf(w))
      .join(' ')
      .substring(0, 300),
  );

  pane1 = viewChild('pane1', {read: ElementRef});
  pane2 = viewChild('pane2', {read: ElementRef});
  pane3 = viewChild('pane3', {read: ElementRef});

  private animationIndex = signal(0);
  private animationSteps: AnimationStep[] = [
    {
      movePane2: [0],
    },
    {
      movePane1: ['-50vw'],
      movePane2: [0],
      scalePane2: [2],
    },
    {
      movePane1: ['12vw'],
      movePane2: ['18vw'],
      scalePane2: [1],
      movePane3: ['50vw'],
    },
    {
      movePane1: ['-2vw'],
      movePane2: [0],
      movePane3: ['2vw'],
    },
  ];

  private animationStep = computed(() =>
    this.animationSteps[this.animationIndex()]);

  constructor() {
    window.addEventListener('keydown', e => {
      let k = e.key;
      if (k === 'ArrowRight') {
        this.animationIndex.update(v => coerceBetween(v + 1, 0, this.animationSteps.length - 1));
      } else if (k === 'ArrowLeft') {
        this.animationIndex.update(v => coerceBetween(v - 1, 0, this.animationSteps.length - 1));
      }
    });

    effect(() => {
      let step = this.animationStep();
      if (!step) {
        return;
      }

      let stepCount = 10;
      let options = {
        duration: stepCount * 120,
        easing: `steps(${stepCount})`,
        fill: 'both',
        step: .5,
      };

      if (step.movePane1) {
        let element = this.pane1().nativeElement;
        element.animate({translate: step.movePane1}, options);
      }

      if (step.movePane2) {
        let element = this.pane2().nativeElement;
        element.animate({translate: step.movePane2}, options);
      }

      if (step.scalePane2) {
        let element = this.pane2().nativeElement;
        element.animate({scale: step.scalePane2}, options);
      }

      if (step.movePane3) {
        let element = this.pane3().nativeElement;
        element.animate({translate: step.movePane3}, options);
      }
    });
  }

}
