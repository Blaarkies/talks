import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ProgressComponent } from '../../../../../common/component/progress/progress.component';
import { getEntropyScore } from '../../common/entropy';

type Data = string;

@Component({
  selector: 'app-entropy-measure',
  standalone: true,
  imports: [
    ProgressComponent,
    PaneComponent,
  ],
  templateUrl: './entropy-measure.component.html',
  styleUrl: './entropy-measure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntropyMeasureComponent {

  header = input<string>();
  data = input.required<Data>();

  protected dataInBytes = computed(() => this.data()?.length);
  protected infoInBytes = computed(() => getEntropyScore(this.data()));
  protected ratio = computed(() => this.infoInBytes() / this.dataInBytes());

}
