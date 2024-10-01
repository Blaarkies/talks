import { NgClass } from '@angular/common';
import {
  Component,
  input,
} from '@angular/core';
import { PaneComponent } from '../../../../../../common/component/pane/pane.component';

@Component({
  selector: 'app-entropy-equation-explained',
  standalone: true,
  imports: [
    PaneComponent,
    NgClass,
  ],
  templateUrl: './entropy-equation-explained.component.html',
  styleUrl: './entropy-equation-explained.component.scss'
})
export class EntropyEquationExplainedComponent {

  step = input.required<number>();

}
