import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBetween } from '../../../../../common';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';
import { LzwStep } from '../../common';
import { encodeToLzw } from '../../common/encode';
import { TextCharacterLighterComponent } from '../../component/text-character-lighter/text-character-lighter.component';
import { LzwCodeLighterComponent } from './lzw-code-lighter/lzw-code-lighter.component';
import { LzwControllerComponent } from './lzw-controller/lzw-controller.component';
import { LzwDictionaryComponent } from './lzw-dictionary/lzw-dictionary.component';

let exampleText = 'EAR_BEAR_EARNS';

@Component({
  selector: 'app-slide-lzw',
  standalone: true,
  imports: [
    PaneComponent,
    TextCharacterLighterComponent,
    LzwControllerComponent,
    LzwDictionaryComponent,
    LzwCodeLighterComponent,
  ],
  templateUrl: './slide-lzw.component.html',
  styleUrl: './slide-lzw.component.scss',
})
export class SlideLzwComponent {

  protected text = signal(exampleText.split(''));
  protected dictionary = signal(encodeToLzw(exampleText));
  protected testInAscii = computed(() =>
    this.text().map(s => s.charCodeAt(0)));
  protected litIndexes = signal<number[] | null>(null);
  protected litStep = signal<LzwStep | null>(null);

  private controller = viewChild(LzwControllerComponent);

  constructor() {
    inject(ClickerService).stepAction$
      .pipe(takeUntilDestroyed())
      .subscribe(a => a === 'right'
                      ? this.controller().continue()
                      : a === 'left'
                        ? this.controller().reset()
                        : 0);

    let presenterStep = signal(0);
    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(8, presenterStep()));
    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(a => presenterStep.update(n => {
        let difference = a === 'right' ? 1 : -1;
        return coerceBetween(n + difference, 0, 14);
      }));
  }

  protected userPointAtDictionary(step: LzwStep) {
    this.litIndexes.set(step?.indexes);
    this.litStep.set(step);
  }

  protected updateLitIndex(index: number | null) {
    if (index === null) {
      return this.litStep.set(null);
    }
    let step = this.dictionary().at(index);
    this.litIndexes.set([step?.indexes?.at(-1)]);
    this.litStep.set(step);
  }

}
