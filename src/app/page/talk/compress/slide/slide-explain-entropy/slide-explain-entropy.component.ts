import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressComponent } from '../../../../../common/component/progress/progress.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';
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
})
export class SlideExplainEntropyComponent {

  protected entropyTextLow = signal(entropyTextLow);
  protected entropyTextMid = signal(entropyTextMid);
  protected entropyTextHigh = signal(entropyTextHigh);

  private pane1 = viewChild('pane1', {read: ElementRef});
  private pane2 = viewChild('pane2', {read: ElementRef});
  private pane3 = viewChild('pane3', {read: ElementRef});

  private animationController = new AnimationController([
    [
      {
        ref: this.pane2,
        job: {
          translate: [0],
          scale: [1],
          width: '100%',
          overflow: ['hidden', 'unset'],
        },
      },
    ],
    [
      {ref: this.pane1, job: {translate: ['-50vw']}},
      {ref: this.pane2, job: {translate: [0], scale: [2]}},
    ],
    [
      {ref: this.pane1, job: {translate: ['6vw'], scale: [1.5]}},
      {
        ref: this.pane2,
        job: {translate: ['24vw'], scale: [1.5], width: '100%', overflow: 'unset'},
      },
      {ref: this.pane3, job: {translate: ['50vw'], scale: [1]}},
    ],
    [
      {ref: this.pane1, job: {translate: ['5vw'], scale: [1.5]}},
      {
        ref: this.pane2,
        job: {translate: ['10vw'], width: '0%', overflow: 'hidden'},
      },
      {ref: this.pane3, job: {translate: ['-5vw'], scale: [1.5]}},
    ],
  ]);

  constructor() {
    let actionAnimationMap = new Map<string, () => void>([
      ['right', () => this.animationController.forward()],
      ['left', () => this.animationController.backward()],
    ]);

    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(newAction => actionAnimationMap.get(newAction)?.());

    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(2, this.animationController.animationIndex()));
  }

}
