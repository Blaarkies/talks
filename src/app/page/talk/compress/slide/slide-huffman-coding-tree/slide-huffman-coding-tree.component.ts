import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { HuffmanCodingTreeComponent } from '../../component/huffman-coding-tree/huffman-coding-tree.component';

const exampleText = 'Example Text';

@Component({
  selector: 'app-slide-huffman-coding-tree',
  standalone: true,
  imports: [
    HuffmanCodingTreeComponent,
  ],
  templateUrl: './slide-huffman-coding-tree.component.html',
  styleUrl: './slide-huffman-coding-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideHuffmanCodingTreeComponent {

  protected text = signal(exampleText);

}