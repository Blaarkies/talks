import {
  Component,
  computed,
  effect,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { toHuffmanTree } from '../../common/encode';
import { Data } from '../../common/entropy';
import { HuffmanCodingTreeNodeComponent } from '../huffman-coding-tree-node/huffman-coding-tree-node.component';
import { HierarchyService } from './hierarchy.service';
import { runTree } from './tree';

type HctNode = ReturnType<typeof toHuffmanTree>;

type HctRow = HctTile[];

interface HctTile extends HctNode {
  x: number;
  y: number;
}

@Component({
  selector: 'app-huffman-coding-tree',
  standalone: true,
  imports: [
    HuffmanCodingTreeNodeComponent,
  ],
  providers: [HierarchyService],
  templateUrl: './huffman-coding-tree.component.html',
  styleUrl: './huffman-coding-tree.component.scss',
})
export class HuffmanCodingTreeComponent {

  data = input<Data>();

  private hierarchyService = inject(HierarchyService);
  private nodes = viewChildren(HuffmanCodingTreeNodeComponent);

  protected grid = computed(() => {
    let tree = toHuffmanTree(this.data());

    let xyTree = runTree(tree);

    let minX = Math.min(...xyTree.map(({xy: [x]}) => x));
    xyTree.forEach(n => n.xy[0] -= minX);

    let maxX = Math.max(...xyTree.map(({xy: [x]}) => x));
    let maxY = Math.max(...xyTree.map(({xy: [, y]}) => y));

    return {
      w: maxX,
      h: maxY,
      tiles: xyTree,
    };
  });

  constructor() {

    effect(() => {
      let map = new Map(
        this.nodes().map(n => [n.tile(), n]),
      );
      this.hierarchyService.setComponentTileMap(map);
    }, {allowSignalWrites: true});

  }

  endHover() {
    this.hierarchyService.setHoverTile(null);
  }
}
