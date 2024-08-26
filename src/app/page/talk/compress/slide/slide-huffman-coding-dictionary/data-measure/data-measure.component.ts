import {
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-data-measure',
  standalone: true,
  imports: [],
  templateUrl: './data-measure.component.html',
  styleUrl: './data-measure.component.scss',
})
export class DataMeasureComponent {

  value = input.required<number>();

}
