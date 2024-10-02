import {
  Component,
  input,
} from '@angular/core';
import { PaneComponent } from '../../../../../../common/component/pane/pane.component';

@Component({
  selector: 'app-surprise-graph',
  standalone: true,
  imports: [
    PaneComponent,
  ],
  templateUrl: './surprise-graph.component.html',
  styleUrl: './surprise-graph.component.scss'
})
export class SurpriseGraphComponent {

  step = input.required<number>();

}
