import {
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-surprise-graph',
  standalone: true,
  imports: [],
  templateUrl: './surprise-graph.component.html',
  styleUrl: './surprise-graph.component.scss'
})
export class SurpriseGraphComponent {

  step = input.required<number>();

}
