import {
  Component,
  effect,
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
import { coerceBetween } from '@app/common';
import { ButtonComponent } from '@component/button';
import { PaneComponent } from '@component/pane';
import { Clicker } from '@app/page/mode-presentation/service/clicker';
import { PresenterNotesData } from '@app/page/presenter-notes';
import { toHuffmanTree } from '../../common/encode';
import { HuffmanCodingPathTrackerTableComponent } from '../../component/huffman-coding-path-tracker-table/huffman-coding-path-tracker-table.component';
import { HuffmanCodingTableComponent } from '../../component/huffman-coding-table/huffman-coding-table.component';
import { HuffmanCodingTreeComponent } from '../../component/huffman-coding-tree/huffman-coding-tree.component';

const exampleText = 'EXAMPLE_TEXT';

type HctNode = ReturnType<typeof toHuffmanTree>;

@Component({
    selector: 'app-slide-huffman-coding-tree',
    imports: [
        HuffmanCodingTreeComponent,
        HuffmanCodingTableComponent,
        HuffmanCodingPathTrackerTableComponent,
        PaneComponent,
        ButtonComponent,
    ],
    templateUrl: './slide-huffman-coding-tree.component.html',
    styleUrl: './slide-huffman-coding-tree.component.scss'
})
export class SlideHuffmanCodingTreeComponent {

  protected text = signal(exampleText);
  protected tree = signal(toHuffmanTree(exampleText));
  protected treeEnabledNodes = signal<HctNode[]>([]);
  protected treeLitNodes = signal<HctNode[]>([]);
  protected isResetting = signal(false);

  private table = viewChild(HuffmanCodingTableComponent);

  constructor() {
    fromEvent(
      inject(WA_WINDOW),
      'keydown',
      (e: KeyboardEvent) => e.key)
      .pipe(
        filter(key => key === 'Enter'),
        mergeWith(inject(Clicker)
          .stepAction$.pipe(filter(s => s === 'right'))),
        takeUntilDestroyed())
      .subscribe(() => this.table().sumNextPair());

    let presenterStep = signal(0);

    let presenterNotesService = inject(PresenterNotesData);
    effect(() => {
      if (this.isResetting()) {
        presenterStep.set(0);
      }
      presenterNotesService.setSlide(6, presenterStep());
    });

    inject(Clicker).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(a => presenterStep.update(n => {
        let difference = a === 'right' ? 1 : -1;
        return coerceBetween(n + difference, 0, 7);
      }));
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
    this.treeEnabledNodes.set([]);
    this.treeLitNodes.set([]);

    this.isResetting.set(true);
    setTimeout(() => this.isResetting.set(false));
  }
}
