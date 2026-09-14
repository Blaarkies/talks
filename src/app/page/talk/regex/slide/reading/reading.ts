import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { PaneComponent } from '@component/pane/pane.component';

@Component({
  selector: 'app-reading',
  imports: [
    PaneComponent,
  ],
  templateUrl: './reading.html',
  styleUrl: './reading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Reading {

  protected step = inject(ClickerService).makeSafeStepperSignal(4);

  protected header = computed(() => this.headers[this.step()]);

  private headers = [
    'Find the outer frame and flags',
    'Break it at the main groups',
    'Find the branching logic',
    'Replace with plain language',
    'A regex pattern is not read as a sentence',
  ];

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(8, this.step()));
  }

}