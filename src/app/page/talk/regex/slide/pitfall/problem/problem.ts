import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { PaneComponent } from '@component/pane/pane.component';
import { PitfallSplitSection } from '@talk/regex/slide/pitfall/type';

@Component({
  selector: 'app-problem',
  imports: [
    NgTemplateOutlet,
    PaneComponent,
  ],
  templateUrl: './problem.html',
  styleUrl: './problem.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Problem {

  heading = input.required<string>();
  description = input.required<PitfallSplitSection[]>();
  example = input.required<PitfallSplitSection[]>();
  solution = input.required<PitfallSplitSection[]>();

}
