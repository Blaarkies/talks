import {
  ElementRef,
  Signal,
} from '@angular/core';

export interface AnimationJob {
  signalRef: Signal<ElementRef>;
  job: PropertyIndexedKeyframes;
}

export type Data = string;

export type TokenElementGroup = {
  eventTarget: EventTarget,
  parentElement: HTMLDivElement,
}
