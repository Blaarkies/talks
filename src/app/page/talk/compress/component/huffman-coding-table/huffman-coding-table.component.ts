import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { unique } from '../../../../../common';
import { toHuffmanTree } from '../../common/encode';

type HctNode = ReturnType<typeof toHuffmanTree>;

@Component({
  selector: 'app-huffman-coding-table',
  standalone: true,
  imports: [],
  templateUrl: './huffman-coding-table.component.html',
  styleUrl: './huffman-coding-table.component.scss',
})
export class HuffmanCodingTableComponent {

  tree = input<HctNode>();

  activeNodesUpdate = output<HctNode[]>();
  parentNodeOfClickedRow = output<HctNode>();
  userPointsAt = output<HctNode[]>();

  protected filteredTable = computed(() => {
    let list = this.frequenciesState();
    if (!list.length) {
      return {precludedRows: [this.tree()], interactablePair: <HctNode[]>[]};
    }

    let lastPair = list.at(-1);

    let availableList = list.slice(0, -1).flat()
      .reduceRight((sum, c) => {
        let label = c.label;
        let allChars = (c.label + sum.used).split('');
        let uniqueChars = unique(allChars);

        if (uniqueChars.length !== allChars.length) {
          return sum;
        }

        sum.used += label;
        sum.entries.push(c);

        return sum;
      }, {used: lastPair.map(p => p.label).join(''), entries: <HctNode[]>[]})
      .entries
      .sort((a,b) => b.frequency - a.frequency);

    return {
      precludedRows: availableList,
      interactablePair: <HctNode[]>lastPair,
    };
  });

  private frequenciesState = signal<HctNode[][]>([]);
  private activeNodes = new Set<HctNode[]>();

  constructor() {
    effect(() => {
      let tree = this.tree();
      let results = this.getNodes(tree);

      this.frequenciesState.set(results);
      this.activeNodes.clear();
      this.activeNodesUpdate.emit([]);
    }, {allowSignalWrites: true});
  }

  private getNodes(tree: HctNode) {
    let results: HctNode[][] = [];
    let nodes: HctNode[] = [tree];
    let queue = [tree];
    while (queue.length) {
      let {children} = queue.pop();

      if (children) {
        results.push(children);
        queue.push(...children);
        nodes.push(...children);
      }
    }

    this.addLabelsToNodes(nodes);
    results = results.map(pair =>
      pair.sort((a, b) => b.frequency - a.frequency));
    results.sort((groupA, groupB) => {
      let fA = groupA[0].frequency + groupA[1].frequency;
      let fB = groupB[0].frequency + groupB[1].frequency;
      return fB - fA;
    });

    return results;
  }

  protected sumPair(pair: HctNode[]) {
    this.activeNodes.add(pair);
    this.parentNodeOfClickedRow.emit(pair[0].parent);
    this.activeNodesUpdate.emit([...this.activeNodes].flat());

    this.frequenciesState
      .update(list => list.filter(n => !this.activeNodes.has(n)));

    // When mouse cursor does not move, pointAt is not updated
    this.userPointAt(this.filteredTable().interactablePair);
  }

  protected userPointAt(pair: HctNode[]) {
    this.userPointsAt.emit(pair);
  }

  private addLabelsToNodes(nodes: HctNode[]) {
    let leafNodes = nodes.filter(n => !n.children);

    let queue = [...leafNodes];
    while (queue.length) {
      let item = queue.pop();

      let parent = item.parent;
      if (parent) {
        queue.push(parent);
      }

      let children = item.children;
      if (!children) {
        item.label = item.char;
        continue;
      }

      item.label = children.map(c => c.label).join('');
    }

  }

  sumNextPair() {
    this.sumPair(this.filteredTable().interactablePair);
  }
}
