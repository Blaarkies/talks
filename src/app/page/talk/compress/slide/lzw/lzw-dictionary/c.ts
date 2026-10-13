import {
  Component,
  inject,
} from '@angular/core';
import { LzwOrchestratorService } from '@talk/compress/slide/lzw/service/lzw-orchestrator';
import { LzwStep } from '../../../common';

@Component({
  selector: 'app-lzw-dictionary',
  imports: [],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export class LzwDictionaryComponent {

  private orchestrator = inject(LzwOrchestratorService);

  protected activeDictionary = this.orchestrator.activeDictionary;
  protected activeStep = this.orchestrator.activeStep;
  protected litStep = this.orchestrator.litStep;

  protected pointsAt(step: LzwStep) {
    this.orchestrator.userPointAtDictionary(step);
  }

}
