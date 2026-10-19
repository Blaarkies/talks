import {
  inject,
  Service,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SlideDeck } from '@app/page/mode-presentation/service/slide-deck';
import { StepPack } from '@app/page/mode-presentation/common/step-pack';
import { PresenterNotesData } from '@app/page/presenter-notes';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  fromEvent,
  map,
  Subject,
  Subscription,
} from 'rxjs';

export type SlideName = number | string | null

type ActiveSlideInfo = {
  name: SlideName
  sub: Subscription
  latestStep?: number
}

@Service({autoProvided: false})
export class Clicker {

  private deck = inject(SlideDeck);
  private router = inject(Router);
  private presenterNotes = inject(PresenterNotesData);

  private activeSlide?: ActiveSlideInfo;
  private oldSlide?: ActiveSlideInfo;

  stepAction$ = new Subject<'right' | 'left'>();

  constructor() {
    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.keydownActionMap.get(event.key)?.(event));
  }

  private keydownActionMap = new Map<string, (event?: KeyboardEvent) => void>([
    ['ArrowLeft', e => this.stepBack()],
    ['ArrowRight', e => this.stepNext()],
    ['ArrowUp', e => this.slideBack()],
    ['ArrowDown', e => this.slideNext()],
    ['Backspace', e => this.quit()],
  ]);

  /** @deprecated */
  right() {
    this.stepAction$.next('right');
  }

  /** @deprecated */
  left() {
    this.stepAction$.next('left');
  }

  slideNext() {
    this.deck.slideNext();
  }

  slideBack() {
    this.deck.slideBack();
  }

  stepNext() {
    this.stepAction$.next('right');
  }

  stepBack() {
    this.stepAction$.next('left');
  }

  quit() {
    this.router.navigate(['../']);
  }

  private stepActionDigit$ = this.stepAction$.pipe(
    map(v => v === 'left' ? -1 : 1));

  registerSlide(name: SlideName, max: number, min = 0): Signal<number> {
    this.activeSlide?.sub.unsubscribe();

    const startStep = this.oldSlide?.name === name
                      ? this.oldSlide?.latestStep
                      : undefined;

    const pack = new StepPack(max, min, startStep);
    this.presenterNotes.setSlide(name, pack.index());

    const sub = this.stepActionDigit$.subscribe(direction => {
      const oob = pack.wouldBeOob(direction);
      switch (oob) {
        case 0:
          pack.commit(direction);
          return this.presenterNotes.setSlide(name, pack.index());
        case -1:
          if (!this.deck.slideBack()) break;

          this.activeSlide.latestStep = pack.index();
          sub.unsubscribe();
          break;
        case 1:
          if (!this.deck.slideNext()) break;

          this.activeSlide.latestStep = pack.index();
          sub.unsubscribe();
          break;
      }
    });

    this.oldSlide = this.activeSlide;
    this.activeSlide = {name, sub};

    return pack.index;
  }

  autoStep(count: number) {
    if (!count) return;

    const repeat = Math.abs(count);
    const right = Math.sign(count) > 0;

    for (let i = 0; i < repeat; i++) {
      right ? this.stepNext() : this.stepBack();
    }
  }

}
