import {
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  coerceBetween,
  makeNumberList,
  unique,
} from '../../../../../common';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';
import { CharOrBin } from '../../common';
import { toBinary } from '../../common/encode';
import { AsciiTableComponent } from '../../component/ascii-table/ascii-table.component';
import { TextCharacterLighterComponent } from '../../component/text-character-lighter/text-character-lighter.component';
import { lineRevealOnStep } from './animations';

const exampleText = 'Example Text';
const asciiBitLength = 7;
const exampleAsciiFromText = [
  ...' !"'.split(''),
  null,
  ...unique((exampleText + 'az').split('')).filter(c => c !== ' ').sort(),
  null,
  ...'}~\u007f'.split(''),
];

const stepsMax = 4;

@Component({
  selector: 'app-slide-ascii-in-binary',
  standalone: true,
  imports: [
    TextCharacterLighterComponent,
    AsciiTableComponent,
  ],
  templateUrl: './slide-ascii-in-binary.component.html',
  styleUrl: './slide-ascii-in-binary.component.scss',
  animations: [lineRevealOnStep],
})
export class SlideAsciiInBinaryComponent {

  protected step = signal(0);

  protected asciiHalf1 = signal(makeNumberList(64)
    .map(n => String.fromCharCode(n)));
  protected asciiHalf2 = signal(makeNumberList(64, 64)
    .map(n => String.fromCharCode(n)));

  protected exampleText = signal(exampleText.split(''));
  protected exampleBinary = signal(this.exampleText()
    .map(c => toBinary(c, asciiBitLength)));
  protected exampleAscii = signal(exampleAsciiFromText);

  protected litChar = signal<CharOrBin>(null);
  protected litBinary = signal<CharOrBin>(null);

  constructor() {
    let actionAnimationMap = new Map<string, () => void>([
      ['right', () => this.step.update(v => coerceBetween(v + 1, 0, stepsMax))],
      ['left', () => this.step.update(v => coerceBetween(v - 1, 0, stepsMax))],
    ]);

    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(newAction => actionAnimationMap.get(newAction)?.());
    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(4, this.step()));
  }

  updateLitCharacter(data: string, isChar = false) {
    if (isChar) {
      let binary = data ? toBinary(data, asciiBitLength) : null;
      this.litChar.set(data);
      this.litBinary.set(binary);

      return;
    }

    let charCode = parseInt(data, 2);
    let char = String.fromCharCode(charCode);

    this.litChar.set(char);
    this.litBinary.set(data);
  }
}
