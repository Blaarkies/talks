import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { toHuffmanDictionary } from '../../common/encode';

type Encoding = ReturnType<ReturnType<typeof toHuffmanDictionary>['get']>;

@Component({
  selector: 'app-huffman-coding-dictionary-lighter',
  standalone: true,
  imports: [],
  templateUrl: './huffman-coding-dictionary-lighter.component.html',
  styleUrl: './huffman-coding-dictionary-lighter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HuffmanCodingDictionaryLighterComponent {

  encodings = input.required<Encoding[]>();
  litCharacter = input<string | null>(null);

  userPointsAt = output<string>();

  pointsAt(char: string | null) {
    this.userPointsAt.emit(char);
  }

}
