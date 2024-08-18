import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ClickerService {

  navigateAction$ = new Subject<'forward' | 'backward'>();
  stepAction$ = new Subject<'right' | 'left'>();

  constructor() {
  }

  forward() {
    this.navigateAction$.next('forward');
  }

  backward() {
    this.navigateAction$.next('backward');
  }

  right() {
    this.stepAction$.next('right');
  }

  left() {
    this.stepAction$.next('left');
  }

}
