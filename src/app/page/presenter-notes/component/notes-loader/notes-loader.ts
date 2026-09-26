import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { scriptExample } from '@app/page/presenter-notes/script-example';
import { ButtonComponent } from '@component/button/button.component';
import { PaneComponent } from '@component/pane/pane.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipComponent } from '@component/tooltip/tooltip.component';

@Component({
  selector: 'app-notes-loader',
  imports: [
    ButtonComponent,
    PaneComponent,
    ReactiveFormsModule,
    TooltipComponent,
  ],
  templateUrl: './notes-loader.html',
  styleUrl: './notes-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesLoader {

  private presenterNotesService = inject(PresenterNotesService);

  scriptSelect = output<string>();

  protected lastUsedScript = this.presenterNotesService.lastUsedScript;

  protected scriptTutorial = scriptExample;

  protected async loadFile(element: EventTarget) {
    if (!(element instanceof HTMLInputElement)) {
      throw Error('HTMLInputElement not provided');
    }

    let file = element.files?.[0];
    if (!file) {
      throw Error('Error loading file');
    }

    let text = await file.text();

    if (!text.startsWith('#slide-0')) {
      element.animate(
        {translate: ['0%', '-9%', '9%', '0%']}, {
          duration: 400,
          iterations: 3,
          direction: 'alternate',
          easing: 'ease-in-out',
        });
      return;
    }

    this.scriptSelect.emit(text);
  }

}
