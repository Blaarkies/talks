import { DOCUMENT } from '@angular/common';
import {
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

export enum SlideMode {
  interactive,
  presentation
}

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {

  private currentMode = signal(SlideMode.interactive);

  slideMode = this.currentMode.asReadonly();

  constructor() {
    let storage = inject(WA_LOCAL_STORAGE);
    let storageKey = 'mode';
    let stringMode = storage.getItem(storageKey);
    let result = stringMode === SlideMode.interactive.toString()
                 ? SlideMode.interactive
                 : SlideMode.presentation;
    this.currentMode.set(result);

    let document = inject(DOCUMENT);

    effect(() => {
      let slideMode = this.currentMode();
      storage.setItem(storageKey, slideMode.toString());

      let fontSizeResult = slideMode === SlideMode.presentation
                           ? '1.45rem'
                           : '1.2rem';
      document.documentElement.style
        .setProperty('--font-size', fontSizeResult);
    });
  }

  setSlideMode(mode: SlideMode) {
    this.currentMode.set(mode);
  }
}
