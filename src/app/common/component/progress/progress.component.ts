import {
  Component,
  input,
} from '@angular/core';
import { chars } from '../../char';

@Component({
  selector: 'app-progress',
  standalone: true,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {

  value = input.required<number>();

  protected fullString = chars.square3.repeat(99);
  protected emptyString = chars.square1.repeat(99);

}
