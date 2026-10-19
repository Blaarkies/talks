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
import { NotesLoader } from './component/notes-loader/notes-loader';
import { NotesViewer } from './component/notes-viewer/notes-viewer';
import { PresenterNotesData } from './service/presenter-notes-data';

@Component({
  selector: 'app-presenter-notes',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NotesLoader,
    NotesViewer,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export class PresenterNotesComponent {

  protected rawNotes = signal<string>(undefined);

  constructor() {
    const presenterNotesService = inject(PresenterNotesData);

    const lastUsed = presenterNotesService.lastUsedScript();
    if (lastUsed) this.rawNotes.set(lastUsed);

    effect(() => {
      const newScript = this.rawNotes();
      if (!newScript) return;

      presenterNotesService.saveNewScript(newScript);
    });
  }


}
