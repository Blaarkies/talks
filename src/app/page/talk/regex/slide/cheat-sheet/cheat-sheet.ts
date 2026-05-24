import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';

@Component({
  selector: 'app-cheat-sheet',
  imports: [],
  templateUrl: './cheat-sheet.html',
  styleUrl: './cheat-sheet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideCheatSheet {

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(8, 0));
  }

}
