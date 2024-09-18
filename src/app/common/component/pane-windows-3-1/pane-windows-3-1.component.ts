import {
  CdkDrag,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'app-pane-windows-3-1',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: './pane-windows-3-1.component.html',
  styleUrl: './pane-windows-3-1.component.scss',
})
export class PaneWindows31Component {

  heading = input<string | undefined>();
  dragBoundaryParent = input<HTMLElement | null>(null);

  protected boundaryElement = computed(() =>
    this.dragBoundaryParent()
    ?? this.self.nativeElement.parentElement);

  private self = inject(ElementRef<HTMLElement>);

}
