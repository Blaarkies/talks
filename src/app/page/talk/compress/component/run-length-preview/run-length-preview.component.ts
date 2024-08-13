import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { sep } from '../../../../../common';
import { splitStringToRunLengthEncoding } from '../../common/encode';

@Component({
  selector: 'app-run-length-preview',
  standalone: true,
  imports: [],
  templateUrl: './run-length-preview.component.html',
  styleUrl: './run-length-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunLengthPreviewComponent {

  data = input.required<string>();
  highlightIndex = input<number | null>(null);

  userPointsAt = output<number>();

  protected strideWidth = computed(() => this.data().indexOf(sep));

  protected runs = computed(() => splitStringToRunLengthEncoding(this.data()));

  pointsAt(index: number | null) {
    this.userPointsAt.emit(index);
  }
}
