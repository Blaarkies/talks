import {
  Component,
  computed,
  inject,
} from '@angular/core';
import { LzwOrchestratorService } from '@talk/compress/slide/lzw/service/lzw-orchestrator';
import { LzwStep } from '../../../common';

@Component({
  selector: 'app-lzw-code-lighter',
  imports: [],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export class LzwCodeLighterComponent {

  private orchestrator = inject(LzwOrchestratorService);

  protected activeStep = this.orchestrator.activeStep;
  protected litStep = this.orchestrator.litStep;

  protected display = computed(() => {
    const steps = this.orchestrator.dictionary();
    const searchElement = this.activeStep();
    const end = searchElement
              ? steps.indexOf(searchElement)
              : steps.length;
    return steps
      .slice(0, end)
      .filter(s => s.output);
  });

  protected pointsAt(step: LzwStep) {
    this.orchestrator.userPointAtDictionary(step);
  }

}
