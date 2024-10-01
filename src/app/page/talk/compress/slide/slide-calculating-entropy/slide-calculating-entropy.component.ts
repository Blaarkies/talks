import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { makeNumberList } from '../../../../../common';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { AnimationController } from '../../common/animation-controller';
import { CoinFlipWorldComponent } from './coin-flip-world/coin-flip-world.component';
import { EntropyEquationExplainedComponent } from './entropy-equation-explained/entropy-equation-explained.component';
import { SurpriseGraphComponent } from './surprise-graph/surprise-graph.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideCalculatingEntropyComponent {

  private coin = viewChild('coin', {read: ElementRef});
  private graph = viewChild('graph', {read: ElementRef});
  private equation = viewChild('equation', {read: ElementRef});
  private example = viewChild('example', {read: ElementRef});

  private animationController = new AnimationController([
    [
      {ref: this.coin, job: {translate: [0,0]}},
      {ref: this.graph, job: {translate: ['0 100vh', '0 100vh']}},
      {ref: this.equation, job: {translate: ['0 100vh', '0 100vh']}},
    ],

    [
      {ref: this.coin, job: {translate: '0 -100vh'}},
      {
        ref: this.graph, job: {translate: 0},
        options: {duration: 700, easing: `steps(7)`},
      },
    ],
    // use blank step for app-surprise-graph component inner workings
    [
      {ref: this.graph, job: {translate: 0}},
      {ref: this.equation, job: {translate: ['0 100vh','0 100vh']}},
    ],

    [
      {ref: this.graph, job: {translate: '0 -100vh'}},
      {
        ref: this.equation, job: {translate: 0},
        options: {duration: 700, easing: `steps(7)`},
      },
    ],

    [],
    [],
    [],
    [],
    [
      {ref: this.equation, job: {translate: 0}},
      {ref: this.example, job: {translate: '0 100vh'}}
    ],

    [
      {ref: this.equation, job: {translate: '0 -100vh'}},
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
  }

}
