import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  delayWhen,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
  timer,
} from 'rxjs';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { AnimationController } from '../../common/animation-controller';
import { stiffyAsset } from '../../data/stiffy';

const sep = '\n';
const ghostOpacity = .2;
const lineModulus = 3;

@Component({
  selector: 'app-slide-teaser',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    PaneComponent,
  ],
  templateUrl: './slide-teaser.component.html',
  styleUrl: './slide-teaser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideTeaserComponent {

  protected stiffyText = signal(stiffyAsset);

  alicesStiffy = viewChild('alicesStiffy', {read: ElementRef});
  compressorsStiffy = viewChild('compressorsStiffy', {read: ElementRef});
  bobsStiffy = viewChild('bobsStiffy', {read: ElementRef});

  compressorDesk = viewChild('compressorDesk', {read: ElementRef});
  bobDesk = viewChild('bobDesk', {read: ElementRef});

  aliceGhost = viewChild('aliceGhost', {read: ElementRef});
  compressorGhost = viewChild('compressorGhost', {read: ElementRef});

  private animationController = new AnimationController([
    [
      {
        ref: this.alicesStiffy,
        job: {width: '100%', translate: 0, opacity: [1, 1]},
      },
      {ref: this.compressorDesk, job: {opacity: 0}},
      {ref: this.aliceGhost, job: {opacity: [0, 0]}},
    ], // 0
    [
      {ref: this.alicesStiffy, job: {translate: '30vw'}},
      {
        ref: this.alicesStiffy,
        job: {translate: '30vw', opacity: 0},
        options: {delay: 500},
      },
      {ref: this.compressorDesk, job: {opacity: 1}, options: {delay: 300}},
      {ref: this.aliceGhost, job: {opacity: ghostOpacity}},
      {
        ref: this.compressorsStiffy, job: {
          translate: 0,
          '--stiffy-color': 'var(--base-color-4)',
          '--stiffy-background': 'var(--base-color-15)',
        }, options: {delay: 1200}},
      {ref: this.compressorGhost, job: {opacity: 0}, options: {delay: 500}},
      {ref: this.bobDesk, job: {opacity: 0}, options: {delay: 500}},
    ], // 1 move and compress disk
    [
      {ref: this.compressorsStiffy, job: {translate: '30vw', opacity: 1}},
      {ref: this.compressorGhost, job: {opacity: ghostOpacity}},
      {ref: this.bobDesk, job: {opacity: 1}},
      {ref: this.bobsStiffy, job: {opacity: [0, 0], '--gap-factor': 0}},
    ], // 2 move into bkob
    [
      {ref: this.compressorsStiffy, job: {translate: '30vw', opacity: [0, 0]}},
      {
        ref: this.bobsStiffy, job: {opacity: [1, 1], '--gap-factor': 2},
        options: {duration: 500},
      },
    ], // 3 decompressing disk
  ]);

  protected animationIndex = this.animationController.animationIndex;

  protected stiffyCompress = toSignal(
    toObservable(this.animationIndex).pipe(
      filter(i => i === 0 || i === 1),
      distinctUntilChanged(),
      delayWhen(i => timer(i === 0 ? 0 : 800)),
      switchMap(step => step === 0
                        ? of(1)
                        : this.makeProgressSteps(lineModulus)),
      map(progress => this.stiffyText().split(sep)
        .filter((_, i) => i % progress === 0)
        .join(sep)),
    ),
  );

  protected stiffyDecompressed = computed(() => this.stiffyText()
    .split(sep)
    .filter((_, i) => i % lineModulus === 0));

  constructor() {
    // TODO: use clicker server provided by PresentationComponent
    window.addEventListener('keydown', e => {
      let k = e.key;
      if (k === 'ArrowRight') {
        this.animationController.forward();
      } else if (k === 'ArrowLeft') {
        this.animationController.backward();
      }
    });
    // TODO END
  }


  private makeProgressSteps(count: number): Observable<number> {
    return timer(0, 300).pipe(
      take(count),
      map(p => p + 1),
    );
  }
}