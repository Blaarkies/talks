import {
  inject,
  linkedSignal,
  Service,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LOCAL_STORAGE_NN } from '@app/common';
import { SlideName } from '@app/page/mode-presentation/service/clicker';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  fromEvent,
  map,
  startWith,
} from 'rxjs';

interface SlideUpdate {
  slideIndex?: string;
  stepIndex?: string;
}

const updateKey = '#slide-update';
const lastUsedKey = '#slide-last-used';
const headerKey = '0';

@Service()
export class PresenterNotesData {

  slideStep = signal<[string, string] | null>([headerKey, '0']);
  lastUsedScript = linkedSignal(() => this.getLastUsedScript());

  private storage = inject(LOCAL_STORAGE_NN);
  private storage$ = fromEvent<StorageEvent>(inject(WA_WINDOW), 'storage')
    .pipe(
      map(e => e.newValue),
      startWith(this.storage.getItem(updateKey)));

  constructor() {
    this.storage$.pipe(takeUntilDestroyed())
      .subscribe(data => {
        const detail = <SlideUpdate>JSON.parse(data);
        if (!detail) return;

        this.slideStep.set([detail.slideIndex, detail.stepIndex]);
      });
  }

  setSlide(slide: SlideName, step: number) {
    if (step < 0) console.error('Negative slide step numbers are not supported');

    const storageValue: SlideUpdate = {
      slideIndex: slide?.toString() ?? headerKey,
      stepIndex: step.toString(),
    };
    this.storage.setItem(updateKey, JSON.stringify(storageValue));
  }

  saveNewScript(script: string) {
    this.storage.setItem(lastUsedKey, script || '');
    this.lastUsedScript.set(script);
  }

  getLastUsedScript(): string {
    return this.storage.getItem(lastUsedKey);
  }

}
