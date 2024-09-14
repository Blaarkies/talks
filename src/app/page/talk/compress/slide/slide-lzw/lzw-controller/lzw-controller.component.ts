import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../../../../../common/component/button/button.component';
import { LzwStep } from '../../../common';
import { animateSlideOut } from './animate-slide-out';

@Component({
  selector: 'app-lzw-controller',
  standalone: true,
  imports: [
    ButtonComponent,
  ],
  templateUrl: './lzw-controller.component.html',
  styleUrl: './lzw-controller.component.scss',
  animations: [animateSlideOut],
})
export class LzwControllerComponent {

  dictionary = input<LzwStep[]>();

  updateActiveStep = output<LzwStep>();

  activeDictionary = computed(() => this.dictionary()
    .slice(0, this.stepIndex() + 1)
    .filter(s => s.dictionaryCode),
  );
  activeStep = computed(() => this.dictionary()?.at(this.stepIndex()));

  constructor() {
    effect(() => this.updateActiveStep.emit(this.activeStep()));
  }

  protected currentCodes = computed(() => {
    let step = this.dictionary().at(this.stepIndex());
    if (!step) {
      return [];
    }
    let full = step.current + step.next;
    let add = step.dictionaryCode && `${step.dictionaryCode}=${full}`;
    return [{
      current: step.current,
      next: step.next,
      output: step.output,
      add,
    }];
  });

  private stepIndex = signal(0);

  reset() {
    this.stepIndex.set(0);
  }

  continue() {
    this.stepIndex.update(v =>
      Math.min(++v, this.dictionary().length));
  }

}
