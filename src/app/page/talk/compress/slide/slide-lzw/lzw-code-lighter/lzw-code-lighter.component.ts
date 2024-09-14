import {
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { LzwStep } from '../../../common';

@Component({
  selector: 'app-lzw-code-lighter',
  standalone: true,
  imports: [],
  templateUrl: './lzw-code-lighter.component.html',
  styleUrl: './lzw-code-lighter.component.scss',
})
export class LzwCodeLighterComponent {

  dictionary = input.required<LzwStep[]>();
  activeStep = input<LzwStep>();
  litStep = input<LzwStep>();

  userPointsAt = output<LzwStep | null>();

  protected pointsAt(step: LzwStep) {
    this.userPointsAt.emit(step);
  }

  protected display = computed(() => {
    let steps = this.dictionary();
    let searchElement = this.activeStep();
    let end = searchElement
              ? steps.indexOf(searchElement)
              : steps.length;
    return steps
      .slice(0, end)
      .filter(s => s.output);
  });

}
