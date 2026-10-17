import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBetween } from '@app/common';
import { Clicker } from '@app/page/mode-presentation/service/clicker';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { PaneComponent } from '@component/pane';
import { LzwOrchestratorService } from '@talk/compress/slide/lzw/service/lzw-orchestrator';
import { LzwStep } from '../../common';
import { encodeToLzw } from '../../common/encode';
import { TextCharacterLighterComponent } from '../../component/text-character-lighter/text-character-lighter.component';
import { LzwCodeLighterComponent } from './lzw-code-lighter/c';
import { LzwControllerComponent } from './lzw-controller/c';
import { LzwDictionaryComponent } from './lzw-dictionary/c';

const exampleText = 'EAR_BEAR_EARNS';

@Component({
  selector: 'app-slide-lzw',
  imports: [
    PaneComponent,
    TextCharacterLighterComponent,
    LzwControllerComponent,
    LzwDictionaryComponent,
    LzwCodeLighterComponent,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export default class SlideLzwComponent {

  private orchestrator = inject(LzwOrchestratorService);

  protected activeDictionary = this.orchestrator.activeDictionary;
  protected litIndexes = this.orchestrator.litIndexes;

  protected text = signal(exampleText.split(''));
  protected testInAscii = computed(() =>
    this.text().map(s => s.charCodeAt(0)));

  constructor() {
    this.orchestrator.setDictionary(encodeToLzw(exampleText));

    inject(Clicker).stepAction$
      .pipe(takeUntilDestroyed())
      .subscribe(a => a === 'right'
                      ? this.orchestrator.continue()
                      : a === 'left'
                        ? this.orchestrator.reset()
                        : 0);

    let presenterStep = signal(0);
    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(8, presenterStep()));
    inject(Clicker).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(a => presenterStep.update(n => {
        let difference = a === 'right' ? 1 : -1;
        return coerceBetween(n + difference, 0, 14);
      }));
  }

  protected userPointAtDictionary(step: LzwStep) {
    this.orchestrator.userPointAtDictionary(step);
  }

  protected updateLitIndex(index: number | null) {
    this.orchestrator.updateLitIndex(index);
  }

}
