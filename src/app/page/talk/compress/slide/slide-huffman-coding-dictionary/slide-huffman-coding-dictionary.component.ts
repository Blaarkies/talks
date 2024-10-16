import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  coerceBetween,
  sum,
} from '../../../../../common';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';
import { CharOrBin } from '../../common';
import {
  encodeToHuffmanCoding,
  toBinary,
  toHuffmanDictionary,
  toHuffmanTree,
} from '../../common/encode';
import { EntropyMeasureComponent } from '../../component/entropy-measure/entropy-measure.component';
import { HuffmanCodingDictionaryLighterComponent } from '../../component/huffman-coding-dictionary-lighter/huffman-coding-dictionary-lighter.component';
import { TextCharacterLighterComponent } from '../../component/text-character-lighter/text-character-lighter.component';
import { DataMeasureComponent } from './data-measure/data-measure.component';

const exampleText = 'EXAMPLE TEXT';
const stepsMax = 3;

@Component({
  selector: 'app-slide-huffman-coding-dictionary',
  standalone: true,
  imports: [
    PaneComponent,
    TextCharacterLighterComponent,
    HuffmanCodingDictionaryLighterComponent,
    EntropyMeasureComponent,
    DataMeasureComponent,
  ],
  templateUrl: './slide-huffman-coding-dictionary.component.html',
  styleUrl: './slide-huffman-coding-dictionary.component.scss',
})
export class SlideHuffmanCodingDictionaryComponent {

  protected step = signal(0);

  protected text = signal(exampleText.split(''));
  protected binary = signal(this.text().map(c => toBinary(c)));
  protected encoded = signal(encodeToHuffmanCoding(exampleText));

  protected litChar = signal<CharOrBin>(null);
  protected litBinary = signal<CharOrBin>(null);
  protected litEncoded = signal<CharOrBin>(null);

  protected encodedAsBinary = computed(() =>
    this.chunkEncodingsIntoByteSize(this.encoded())
      .map(c => parseInt(c, 2)));

  private dictionary = toHuffmanDictionary(toHuffmanTree(exampleText));
  private reversedDictionary = new Map(Array.from(this.dictionary.values())
    .map(p => [p.path, p]));

  protected dictionaryList = signal(Array.from(this.dictionary.values())
    .sort((a, b) => a.path.length - b.path.length));
  protected dictionaryListSize = computed(() => Math.ceil(
    sum(this.dictionaryList().map(p => 8 + p.path.length))
    / 8));

  constructor() {
    let actionAnimationMap = new Map<string, () => void>([
      ['right', () => this.step.update(v => coerceBetween(v + 1, 0, stepsMax))],
      ['left', () => this.step.update(v => coerceBetween(v - 1, 0, stepsMax))],
    ]);

    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(newAction => actionAnimationMap.get(newAction)?.());
    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(5, this.step()));
  }

  updateLitCharacter(data: string, type: 'char' | 'binary' | 'encoded') {
    let character: string, binary: string, encoded: string;

    switch (type) {
      case 'char':
        character = data;
        binary = data ? toBinary(data) : null;
        encoded = this.dictionary.get(data)?.path;
        break;

      case 'binary':
        character = String.fromCharCode(parseInt(data, 2));
        binary = data;
        encoded = this.dictionary.get(character)?.path;
        break;

      case 'encoded':
        character = this.reversedDictionary.get(data)?.char;
        binary = character ? toBinary(character) : null;
        encoded = data;
        break;
    }

    this.litChar.set(character);
    this.litBinary.set(binary);
    this.litEncoded.set(encoded);
  }

  /**
   * Re-slices the contents of `encodings` by combining or splitting
   * each element with its next neighbour until elements are 8 characters
   * long.
   */
  private chunkEncodingsIntoByteSize(encodings: string[]): string[] {
    return encodings
      .flatMap(c => c.split(''))
      .reduce((sum, c) => {
        if (sum.at(-1).length < 8) {
          sum.push(sum.pop() + c);
          return sum;
        }

        sum.push(c);
        return sum;
      }, ['']);
  }
}
