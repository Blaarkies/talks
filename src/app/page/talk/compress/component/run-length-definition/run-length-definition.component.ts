import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-run-length-definition',
  standalone: true,
  imports: [],
  templateUrl: './run-length-definition.component.html',
  styleUrl: './run-length-definition.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunLengthDefinitionComponent {

  defs = input.required<(number | string)[][]>();
  stride = input.required<number>();
  litIndex = input<number | null>(null);

  userPointsAt = output<number>();

  pointsAt(index: number) {
    this.userPointsAt.emit(index);
  }
}
