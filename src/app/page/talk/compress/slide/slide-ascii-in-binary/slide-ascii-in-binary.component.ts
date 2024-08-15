import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { lineRevealOnStep } from './animations';
import { AsciiTableComponent } from '../../component/ascii-table/ascii-table.component';
import { TextCharacterLighterComponent } from '../../component/text-character-lighter/text-character-lighter.component';

const exampleText = 'Example Text';
const bitLength = 7;
const exampleAsciiFromText = [
  ...' !"'.split(''),
  null,
  ...unique((exampleText + 'az').split('')).filter(c => c !== ' ').sort(),
  null,
  ...'}~\u007f'.split(''),
];

function toBinary(value: string): string {
  return value
    .charCodeAt(0)
    .toString(2)
    .padStart(bitLength, '0');
}

type CharOrBin = string | null;

const stepsMax = 2;

@Component({
  selector: 'app-slide-ascii-in-binary',
  standalone: true,
  imports: [
    TextCharacterLighterComponent,
    AsciiTableComponent,
  ],
  templateUrl: './slide-ascii-in-binary.component.html',
  styleUrl: './slide-ascii-in-binary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [lineRevealOnStep],
})
export class SlideAsciiInBinaryComponent {

  protected step = signal(0);

  protected asciiHalf1 = signal(makeNumberList(64)
    .map(n => String.fromCharCode(n)));
  protected asciiHalf2 = signal(makeNumberList(64, 64)
    .map(n => String.fromCharCode(n)));

  protected exampleText = signal(exampleText.split(''));
  protected exampleBinary = signal(this.exampleText().map(c => toBinary(c)));
  protected exampleAscii = signal(exampleAsciiFromText);

  protected litChar = signal<CharOrBin>(null);
  protected litBinary = signal<CharOrBin>(null);

  private clickerService = inject(ClickerService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    let actionAnimationMap = new Map<string, () => void>([
      ['right', () => this.step.update(v => coerceBetween(v + 1, 0, stepsMax))],
      ['left', () => this.step.update(v => coerceBetween(v - 1, 0, stepsMax))],
    ]);

    this.clickerService.stepAction$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(newAction => actionAnimationMap.get(newAction)?.());
  }

  updateLitCharacter(data: string, isChar = false) {
    if (isChar) {
      let binary = data ? toBinary(data) : null;
      this.litBinary.set(binary);

      return;
    }

    let charCode = parseInt(data, 2);
    let char = String.fromCharCode(charCode);

    this.litChar.set(char);
    this.litBinary.set(data);
  }
}
