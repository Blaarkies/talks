import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ProgressComponent } from '../../../../../common/component/progress/progress.component';
import { Data } from '../../common';
import { getEntropyScore } from '../../common/entropy';

@Component({
  selector: 'app-entropy-measure',
  standalone: true,
  imports: [
    ProgressComponent,
  ],
  templateUrl: './entropy-measure.component.html',
  styleUrl: './entropy-measure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntropyMeasureComponent {

  data = input.required<Data>();

  protected dataInBytes = computed(() => this.data()?.length);
  protected infoInBytes = computed(() => getEntropyScore(this.data()));
  protected ratio = computed(() => this.infoInBytes() / this.dataInBytes());

}
