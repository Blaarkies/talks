import {
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  WA_LOCAL_STORAGE,
  WA_WINDOW,
} from '@ng-web-apis/common';
import {
  fromEvent,
  map,
  startWith,
} from 'rxjs';

interface SlideUpdate {
  slideIndex?: string;
  stepIndex?: string;
}

let updateKey = '#slide-update';
let lastUsedKey = '#slide-last-used';
let headerKey = '0';

@Injectable({
  providedIn: 'root',
})
export class PresenterNotesService {

  slideStep = signal<[string, string] | null>([headerKey, '0']);

  private storage = inject(WA_LOCAL_STORAGE);
  private storage$ = fromEvent<StorageEvent>(
    inject(WA_WINDOW), 'storage')
    .pipe(
      map(e => e.newValue),
      startWith(this.storage.getItem(updateKey)));

  constructor() {
    this.storage$.pipe(takeUntilDestroyed())
      .subscribe(data => {
        let detail = <SlideUpdate>JSON.parse(data);
        if (detail) {
          this.slideStep.set(
            [detail.slideIndex, detail.stepIndex]);
        }
      });
  }

  setSlide(slide: number | string | null, step: number) {
    let storageValue: SlideUpdate = {
      slideIndex: slide?.toString() ?? headerKey,
      stepIndex: step.toString(),
    };
    this.storage.setItem(updateKey, JSON.stringify(storageValue));
  }

  saveNewScript(script: string) {
    this.storage.setItem(lastUsedKey, script || '');
  }

  getLastUsedScript(): string {
    return this.storage.getItem(lastUsedKey);
  }

}
