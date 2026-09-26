import {
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NotesLoader } from '@app/page/presenter-notes/component/notes-loader/notes-loader';
import { NotesViewer } from '@app/page/presenter-notes/component/notes-viewer/notes-viewer';
import { PresenterNotesService } from './presenter-notes.service';

@Component({
  selector: 'app-presenter-notes',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NotesLoader,
    NotesViewer,
  ],
  templateUrl: './presenter-notes.component.html',
  styleUrl: './presenter-notes.component.scss',
})
export class PresenterNotesComponent {

  private presenterNotesService = inject(PresenterNotesService);

  protected rawNotes = signal<string>(undefined);

  constructor() {
    const lastUsed = this.presenterNotesService.lastUsedScript();
    if (lastUsed) {
      this.rawNotes.set(lastUsed);
    }

    effect(() => {
      let newScript = this.rawNotes();
      if (!newScript) return;

      this.presenterNotesService.saveNewScript(newScript);
    });
  }


}
