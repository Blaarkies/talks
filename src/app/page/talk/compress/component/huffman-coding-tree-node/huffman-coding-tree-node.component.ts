import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  filter,
  map,
  switchMap,
} from 'rxjs';
import { lerp } from '../../../../../common';
import { toHuffmanTree } from '../../common/encode';
import { HierarchyService } from '../huffman-coding-tree/hierarchy.service';

type HctNode = ReturnType<typeof toHuffmanTree>;

@Component({
  selector: 'app-huffman-coding-tree-node',
  standalone: true,
  imports: [],
  templateUrl: './huffman-coding-tree-node.component.html',
  styleUrl: './huffman-coding-tree-node.component.scss',
})
export class HuffmanCodingTreeNodeComponent {

  tile = input<HctNode>();
  disabled = input<boolean>();
  isPointedAt = input<boolean>();

  protected svgPoints = toSignal(
    toObservable(this.tile).pipe(
      filter(tile => !!tile.children),
      switchMap(tile => this.hierarchyService.getChildren(tile.children)),
      map(childrenComponents => childrenComponents
        .map((child, i) => {
          let rect = this.self.nativeElement.getBoundingClientRect();
          let centerX = rect.width / 2;

          let parentLocation = this.getLocation(true);
          let childLocation = child.getLocation();

          let xEnd = childLocation[0] - parentLocation[0] + centerX;
          let yEnd = childLocation[1] - parentLocation[1];
          let yLerp = lerp(0, yEnd);

          let locations = [
            [centerX, 0],
            [centerX, yLerp],
            [xEnd, yLerp],
            [xEnd, yEnd],
          ];

          return {
            component: child,
            points: locations.map(p => p.join(',')).join(' '),
            isLit: i === 0 ? this.childALit : this.childBLit,
          };
        })),
    ),
  );

  protected isLit = computed(() => {
    let set = this.hierarchyService.hoveredSet();
    return set ? set.has(this) : false;
  });

  protected thisLit = signal(false);
  protected childALit = signal(false);
  protected childBLit = signal(false);

  private hierarchyService = inject(HierarchyService);
  private self = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      let set = this.hierarchyService.hoveredSet();
      if (!set) {
        return;
      }
      this.thisLit.set(set.has(this));
      let entries = [...set].map(n => [n, n.tile()]);

      let children = this.tile().children;
      if (!children) {
        return;
      }

      let [a, b] = children
        .map(c => entries.find(([, t]) => c === t)
          ?.[0] as HuffmanCodingTreeNodeComponent);

      this.childALit.set(set.has(a));
      this.childBLit.set(set.has(b));
    }, {allowSignalWrites: true});
  }

  private getLocation(bottomReference = false): [number, number] {
    let rect = this.self.nativeElement.getBoundingClientRect();
    let centerX = rect.left + rect.width / 2;

    return [centerX, bottomReference ? rect.bottom : rect.top];
  }

  protected startHover() {
    this.hierarchyService.setHoverTile(this);
  }

}
