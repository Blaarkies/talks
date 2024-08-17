import {
  ElementRef,
  Signal,
} from '@angular/core';

export interface AnimationJob {
  ref: Signal<ElementRef>;
  job: PropertyIndexedKeyframes;
  options?: KeyframeAnimationOptions;
}

export type Data = string | number[] | BinaryData;

export type TokenElementGroup = {
  eventTarget: EventTarget,
  parentElement: HTMLDivElement,
}

export type CharOrBin = string | null;