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

  private storageKey = 'mode';
  private storage = inject(WA_LOCAL_STORAGE);
  private document = inject(DOCUMENT);

  constructor() {
    let stringMode = this.storage.getItem(this.storageKey);
    let result = stringMode === SlideMode.interactive.toString()
                 ? SlideMode.interactive
                 : SlideMode.presentation;
    this.setSlideMode(result);
  }

  updateFontSize() {
    this.storage.setItem(this.storageKey, this.currentMode().toString());

    let fontSizeResult = this.currentMode() === SlideMode.presentation
                         ? '1.45rem'
                         : '1.2rem';
    this.document
      .documentElement
      .style
      .setProperty('--font-size', fontSizeResult);
  }

  setSlideMode(mode: SlideMode) {
    this.currentMode.set(mode);
  }
}
