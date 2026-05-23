import { Signal } from '@angular/core';

export { ModePresentation } from './mode-presentation';
export { routes } from './route';

export interface HasRimHeader {
  rimHeaderHeight: Signal<number>;
}