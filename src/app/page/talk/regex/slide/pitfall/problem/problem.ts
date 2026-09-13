import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { PaneComponent } from '@component/pane/pane.component';
import { Pitfall } from '@talk/regex/slide/pitfall/pitfall';

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

  pitfall = input.required<Pitfall>();

  protected heading = computed(() => this.pitfall().heading);
  protected description = computed(() => this.pitfall().description);
  protected example = computed(() => this.pitfall().example);
  protected solution = computed(() => this.pitfall().solution);

}
