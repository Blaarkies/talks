import {
  Component,
  input,
} from '@angular/core';
import { PaneComponent } from '../../../../../../common/component/pane/pane.component';

@Component({
  selector: 'app-deep-learning-compression',
  standalone: true,
  imports: [
    PaneComponent,
  ],
  templateUrl: './deep-learning-compression.component.html',
  styleUrl: './deep-learning-compression.component.scss'
})
export class DeepLearningCompressionComponent {

  step = input.required<number>();

}
