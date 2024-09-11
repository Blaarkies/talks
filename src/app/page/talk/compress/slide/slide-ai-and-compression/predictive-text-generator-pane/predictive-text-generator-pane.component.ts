import {
  Component,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PaneComponent } from '../../../../../../common/component/pane/pane.component';

@Component({
  selector: 'app-predictive-text-generator-pane',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    PaneComponent,
  ],
  templateUrl: './predictive-text-generator-pane.component.html',
  styleUrl: './predictive-text-generator-pane.component.scss',
})
export class PredictiveTextGeneratorPaneComponent {

  step = input.required<number>();

}
