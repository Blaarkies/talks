import {
  DestroyRef,
  inject,
  Injectable,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  filter,
  map,
  Observable,
  ReplaySubject,
  Subject,
  take,
} from 'rxjs';
import { flattenNestedValues } from '../../../../../common';
import { toHuffmanTree } from '../../common/encode';
import { HuffmanCodingTreeNodeComponent } from '../huffman-coding-tree-node/huffman-coding-tree-node.component';

type HctNode = ReturnType<typeof toHuffmanTree>;

@Injectable()
export class HierarchyService {

  private tileComponentMap$ = new ReplaySubject<Map<unknown, HuffmanCodingTreeNodeComponent>>(1);
  private hoveredSet$ = new Subject<Set<HuffmanCodingTreeNodeComponent>>();

  hoveredSet = toSignal(this.hoveredSet$);

  private destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.tileComponentMap$.complete();
      this.hoveredSet$.complete();
    });
  }

  setComponentTileMap(tileComponentMap: Map<unknown, HuffmanCodingTreeNodeComponent>) {
    this.tileComponentMap$.next(tileComponentMap);
  }

  getChildren(children: HctNode[]): Observable<HuffmanCodingTreeNodeComponent[]> {
    return this.tileComponentMap$.pipe(
      map(m => children.map(c => m.get(c))));
  }

  setHoverTile(component: HuffmanCodingTreeNodeComponent | null) {
    if (!component) {
      this.hoveredSet$.next(new Set());
      return;
    }
    this.tileComponentMap$
      .pipe(take(1))
      .subscribe(tileMap => {
        if (!tileMap.size) {
          this.hoveredSet$.next(new Set([component]));
          return;
        }

        let flat = flattenNestedValues(component,
          item => tileMap.get(item.tile().parent));
        this.hoveredSet$.next(new Set(flat));

      });

  }
}
