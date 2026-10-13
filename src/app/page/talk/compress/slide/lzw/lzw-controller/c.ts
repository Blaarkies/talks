import {
  Component,
  computed,
  inject,
} from '@angular/core';
import { ID } from '@app/common';
import { ButtonComponent } from '@component/button';
import { LzwOrchestratorService } from '@talk/compress/slide/lzw/service/lzw-orchestrator';
import {
  AnimationState,
  CodeDisplay,
  CodeWithState,
} from '@talk/compress/slide/lzw/type';

@Component({
  selector: 'app-lzw-controller',
  imports: [
    ButtonComponent,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export class LzwControllerComponent {

  private idMaker = inject(ID);
  private orchestrator = inject(LzwOrchestratorService);
  private stepIndex = this.orchestrator.stepIndex;

  private codes = computed(() => this.orchestrator.dictionary()
    .map(step => {
      const full = step.current + step.next;
      const add = step.dictionaryCode && `${step.dictionaryCode}=${full}`;
      return <CodeDisplay>{
        current: step.current,
        next: step.next,
        output: step.output,
        add,
        id: this.idMaker.make(),
      };
    }));

  protected codesWithState = computed(() => {
    const step = this.stepIndex();
    return this.codes().map((c, i) => {
      const withState = <CodeWithState>c;
      withState.state = this.getAnimationState(step, i);
      return withState;
    });
  });

  protected canContinue = computed(() =>
    this.orchestrator.dictionary().length !== this.orchestrator.stepIndex());

  protected isDone = computed(() =>
    this.stepIndex() === this.codesWithState().length);

  private getAnimationState(step: number, itemIndex: number): AnimationState {
    const state = itemIndex - step;
    return state < 0
           ? 'past'
           : state === 0
             ? 'present'
             : 'future';
  }

  protected reset() {
    this.orchestrator.reset();
  }

  protected continue() {
    this.orchestrator.continue();
  }

}
