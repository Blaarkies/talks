import {
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  filter,
  fromEvent,
  mergeWith,
} from 'rxjs';
import { ButtonComponent } from '../../../../../common/component/button/button.component';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { toHuffmanTree } from '../../common/encode';
import { HuffmanCodingPathTrackerTableComponent } from '../../component/huffman-coding-path-tracker-table/huffman-coding-path-tracker-table.component';
import { HuffmanCodingTableComponent } from '../../component/huffman-coding-table/huffman-coding-table.component';
import { HuffmanCodingTreeComponent } from '../../component/huffman-coding-tree/huffman-coding-tree.component';

const exampleText = 'EXAMPLE_TEXT';

type HctNode = ReturnType<typeof toHuffmanTree>;

@Component({
  selector: 'app-slide-huffman-coding-tree',
  standalone: true,
  imports: [
    HuffmanCodingTreeComponent,
    HuffmanCodingTableComponent,
    HuffmanCodingPathTrackerTableComponent,
    PaneComponent,
    ButtonComponent,
  ],
  templateUrl: './slide-huffman-coding-tree.component.html',
  styleUrl: './slide-huffman-coding-tree.component.scss',
})
export class SlideHuffmanCodingTreeComponent {

  protected text = signal(exampleText);
  protected tree = signal(toHuffmanTree(exampleText));
  protected treeEnabledNodes = signal<HctNode[]>([]);
  protected treeLitNodes = signal<HctNode[]>([]);
  protected isResetting = signal(false);

  private table = viewChild(HuffmanCodingTableComponent);

  constructor() {
    let window = inject(WA_WINDOW);
    let clickerService = inject(ClickerService);

    fromEvent(window, 'keydown', (e: KeyboardEvent) => e.key)
      .pipe(
        filter(key => key === 'Enter'),
        mergeWith(clickerService.stepAction$.pipe(filter(s => s === 'right'))),
        takeUntilDestroyed())
      .subscribe(() => this.table().sumNextPair());
  }

  protected tablePointsAt(pair: HctNode[]) {
    this.treeLitNodes.set(pair);
  }

  protected pathTrackUpdate(paths: Record<string, string>) {
    this.treeEnabledNodes.set(Object.keys(paths) as any);
  }

  protected activeNodesUpdate(nodes: HctNode[]) {
    let tree = this.tree();
    let topIsReached = nodes.some(n => n === tree.children[0]);
    this.treeEnabledNodes.set(topIsReached ? [...nodes, tree] : nodes);
  }

  protected resetTree() {
    this.isResetting.set(true);
    setTimeout(() => this.isResetting.set(false));
  }
}
