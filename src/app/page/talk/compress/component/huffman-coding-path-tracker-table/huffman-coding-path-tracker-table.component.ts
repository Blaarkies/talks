import {
  Component,
  computed,
  output,
  signal,
} from '@angular/core';
import { toHuffmanTree } from '../../common/encode';

type HctNode = ReturnType<typeof toHuffmanTree>;

@Component({
  selector: 'app-huffman-coding-path-tracker-table',
  standalone: true,
  imports: [],
  templateUrl: './huffman-coding-path-tracker-table.component.html',
  styleUrl: './huffman-coding-path-tracker-table.component.scss',
})
export class HuffmanCodingPathTrackerTableComponent {

  pathsUpdated = output<Record<string, string>>();

  protected charPaths = computed(() => {
    let newList = Object.entries(this.trackedCharPaths())
      .sort(([a], [b]) => a.localeCompare(b));
    let displaySet = new Set(this.displayList.map(([c]) => c));
    newList.forEach(r => {
      if (!displaySet.has(r[0])) {
        this.displayList.push(r);
        return;
      }
      this.displayList.find(([c]) => c === r[0])[1] = r[1];
    });
    return this.displayList;
  });

  private displayList: [string, string][] = [];
  private trackedCharPaths = signal<Record<string, string>>({});

  newSummedPair(parent: HctNode) {
    let paths = this.trackedCharPaths();

    let queue = parent.children.map(item => ({item, level: 0}));
    while (queue.length) {
      let {item, level} = queue.pop();
      level++;

      let char = item.char;
      if (char) {
        paths[char] = item.path.slice(-level);
      }

      let children = item.children;
      if (!children) {
        continue;
      }
      queue.push(...children.map(c => ({item: c, level})));
    }

    this.trackedCharPaths.set({...paths});
    this.pathsUpdated.emit(paths);
  }

}
