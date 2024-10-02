import { Signal } from '@angular/core';

export { ModePresentationComponent } from './mode-presentation.component';
export { routes } from './route';

export interface HasRimHeader {
  rimHeaderHeight: Signal<number>;
}