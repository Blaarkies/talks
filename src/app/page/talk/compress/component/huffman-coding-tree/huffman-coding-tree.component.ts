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
import { addGridPositionsToTree } from './tree';

type HctNode = ReturnType<typeof toHuffmanTree>;

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

  tree = input.required<HctNode>();
  enabledNodes = input<HctNode[]>();
  litNodes = input<HctNode[]>();

  private hierarchyService = inject(HierarchyService);
  private nodeElements = viewChildren(HuffmanCodingTreeNodeComponent);

  protected grid = computed(() => {
    let xyTree = addGridPositionsToTree(this.tree());

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
      let map = new Map(this.nodeElements()
        .map(element => [element.tile(), element]));
      this.hierarchyService.setComponentTileMap(map);
    }, {allowSignalWrites: true});
  }

  endHover() {
    this.hierarchyService.setHoverTile(null);
  }
}
