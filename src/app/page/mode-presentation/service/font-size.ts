import {
  DOCUMENT,
  inject,
  Service,
  signal,
} from '@angular/core';
import { LOCAL_STORAGE_NN } from '@app/common';

export enum SlideMode {
  interactive,
  presentation
}

@Service()
export class FontSizeService {

  private currentMode = signal(SlideMode.interactive);

  slideMode = this.currentMode.asReadonly();

  private storageKey = 'mode';
  private storage = inject(LOCAL_STORAGE_NN);
  private document = inject(DOCUMENT);

  constructor() {
    let stringMode = this.storage.getItem(this.storageKey);
    let result = stringMode === SlideMode.presentation.toString()
                 ? SlideMode.presentation
                 : SlideMode.interactive;
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
