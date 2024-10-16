import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { makeNumberList } from '../../../../../common';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';
import { AnimationController } from '../../common/animation-controller';
import { CoinFlipWorldComponent } from './coin-flip-world/coin-flip-world.component';
import { EntropyEquationExplainedComponent } from './entropy-equation-explained/entropy-equation-explained.component';
import { SurpriseGraphComponent } from './surprise-graph/surprise-graph.component';

let instantOffscreen = ['0 100vh', '0 100vh'];
let animateOffscreen = '0 -100vh';

@Component({
  selector: 'app-slide-calculating-entropy',
  standalone: true,
  imports: [
    CoinFlipWorldComponent,
    SurpriseGraphComponent,
    EntropyEquationExplainedComponent,
    PaneComponent,
  ],
  templateUrl: './slide-calculating-entropy.component.html',
  styleUrl: './slide-calculating-entropy.component.scss',
})
export class SlideCalculatingEntropyComponent {

  private coin = viewChild('coin', {read: ElementRef});
  private graph = viewChild('graph', {read: ElementRef});
  private equation = viewChild('equation', {read: ElementRef});
  private example = viewChild('example', {read: ElementRef});

  private animationController = new AnimationController([
    // Coin
    [
      {ref: this.coin, job: {translate: [0, 0]}},
      ...[this.graph, this.equation, this.example]
        .map(ref => ({ref, job: {translate: instantOffscreen}})),
    ],

    // Graph
    [
      {ref: this.coin, job: {translate: animateOffscreen}},
      {
        ref: this.graph, job: {translate: 0},
        options: {duration: 700, easing: `steps(7)`},
      },
    ],
    [
      {ref: this.graph, job: {translate: 0}},
      {ref: this.equation, job: {translate: instantOffscreen}},
    ],

    // Equation
    [
      {ref: this.graph, job: {translate: animateOffscreen}},
      {
        ref: this.equation, job: {translate: 0},
        options: {duration: 700, easing: `steps(7)`},
      },
    ],
    ...makeNumberList(4).map(() => []), // blank steps for Equation inner workings
    [
      {ref: this.equation, job: {translate: 0}},
      {ref: this.example, job: {translate: instantOffscreen}},
    ],

    // Example
    [
      {ref: this.equation, job: {translate: animateOffscreen}},
      {
        ref: this.example, job: {translate: 0},
        options: {duration: 700, easing: `steps(7)`},
      },
    ],
  ]);

  protected animationIndex = this.animationController.animationIndex;

  constructor() {
    let actionAnimationMap = new Map<string, () => void>([
      ['right', () => this.animationController.forward()],
      ['left', () => this.animationController.backward()],
    ]);

    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(newAction => actionAnimationMap.get(newAction)?.());

    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(11, this.animationIndex()));
  }

}
