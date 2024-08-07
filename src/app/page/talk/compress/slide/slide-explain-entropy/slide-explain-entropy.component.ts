import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressComponent } from '../../../../../common/component/progress/progress.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { AnimationController } from '../../common/animation-controller';
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

  private animationController = new AnimationController([
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
  ]);

  private clickerService = inject(ClickerService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    let actionAnimationMap = new Map<string, () => void>([
      ['right', () => this.animationController.forward()],
      ['left', () => this.animationController.backward()],
    ]);

    this.clickerService.stepAction$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(newAction => actionAnimationMap.get(newAction)?.());
  }

}
