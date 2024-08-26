import {
  Component,
  computed,
  input,
} from '@angular/core';
import { isArray } from '../../../../../common';
import { ProgressComponent } from '../../../../../common/component/progress/progress.component';
import { Data } from '../../common';
import { toEntropyInBytes } from '../../common/entropy';

@Component({
  selector: 'app-entropy-measure',
  standalone: true,
  imports: [
    ProgressComponent,
  ],
  templateUrl: './entropy-measure.component.html',
  styleUrl: './entropy-measure.component.scss',
})
export class EntropyMeasureComponent {

  data = input.required<Data>();

  protected dataInBytes = computed(() => {
    let data = this.data();
    return typeof data === 'string'
           ? data?.length
           : isArray(data)
             ? data.length
             : ArrayBuffer.isView(data)
               ? data.byteLength
               : 0;
  });
  protected infoInBytes = computed(() => toEntropyInBytes(this.data()));
  protected ratio = computed(() => this.infoInBytes() / this.dataInBytes());

}
