import {
  computed,
  effect,
  Injectable,
  signal,
} from '@angular/core';
import { LzwStep } from '@talk/compress/common';

@Injectable({providedIn: 'root'})
export class LzwOrchestratorService {

  stepIndex = signal(0);
  dictionary = signal<LzwStep[]>([]);
  litIndexes = signal<number[] | null>(null);
  litStep = signal<LzwStep | null>(null);

  activeStep = computed(() => this.dictionary()[this.stepIndex()]);
  activeDictionary = computed(() => this.dictionary()
    .slice(0, this.stepIndex() + 1)
    .filter(s => s.dictionaryCode),
  );

  constructor() {
    effect(() => {
      const step = this.activeStep();
      this.userPointAtDictionary(step);
    })
  }

  userPointAtDictionary(step: LzwStep) {
    this.litStep.set(step);
    this.litIndexes.set(step?.indexes);
  }

  updateLitIndex(index: number | null) {
    if (index === null) return this.litStep.set(null);

    const step = this.dictionary().at(index);
    this.litIndexes.set([step?.indexes?.at(-1)]);
    this.litStep.set(step);
  }

  setDictionary(dictionary: LzwStep[]) {
    this.dictionary.set(dictionary);
    this.stepIndex.set(0);
  }

  continue() {
    if (this.stepIndex() >= this.dictionary().length) return;
    this.stepIndex.update(v => v + 1);
  }

  reset() {
    this.stepIndex.set(0);
  }

}