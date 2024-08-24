import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
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
import { HierarchyService } from '../huffman-coding-tree/hierarchy.service';

@Component({
  selector: 'app-huffman-coding-tree-node',
  standalone: true,
  imports: [],
  templateUrl: './huffman-coding-tree-node.component.html',
  styleUrl: './huffman-coding-tree-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HuffmanCodingTreeNodeComponent {

  tile = input<{
    parent;
    char;
    path;
  }>();

  protected parentRelativeLocation = toSignal(
    toObservable(this.tile).pipe(
      filter(tile => !!tile.parent),
      switchMap(tile => this.hierarchyService.getParent(tile.parent)),
      map(parentComponent => {
        let rect = this.self.nativeElement.getBoundingClientRect();
        let centerX = rect.width / 2;

        let parentLocation = parentComponent.getLocation(true);
        let location = this.getLocation();

        let x4 = parentLocation[0] - location[0] + centerX;
        let y4 = parentLocation[1] - location[1];
        let yLerp = lerp(0, y4);

        let locations = [
          [centerX, 0],
          [centerX, yLerp],
          [x4, yLerp],
          [x4, y4],
        ];

        let results = locations.map(p => p.join(',')).join(' ');
        return results;
      }),
    ),
  );

  protected isLit = computed(() => {
    let set = this.hierarchyService.hoveredSet();
    return set ? set.has(this) : false;
  });

  private hierarchyService = inject(HierarchyService);
  private self = inject(ElementRef<HTMLElement>);

  getLocation(ofParent = false) {
    let rect = this.self.nativeElement.getBoundingClientRect();
    let centerX = rect.left + rect.width / 2;
    return ofParent
           ? [centerX, rect.bottom]
           : [centerX, rect.top];
  }

  protected startHover() {
    this.hierarchyService.setHoverTile(this);
  }

}
