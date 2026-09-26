import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  coerceBetween,
  isArray,
  sep,
} from '@app/common';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { FontSizer } from '@app/page/presenter-notes/component/font-sizer/font-sizer';
import { Teleprompter } from '@app/page/presenter-notes/component/teleprompter/teleprompter';
import { Timer } from '@app/page/presenter-notes/component/timer/timer';
import { ButtonComponent } from '@component/button/button.component';
import {
  tagSlide,
  tagStep,
} from './tag';

@Component({
  selector: 'app-notes-viewer',
  imports: [
    ButtonComponent,
    Timer,
    FontSizer,
    Teleprompter,
  ],
  templateUrl: './notes-viewer.html',
  styleUrl: './notes-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesViewer {

  private presenterNotesService = inject(PresenterNotesService);
  private currentSlideStep = this.presenterNotesService.slideStep;

  rawNotes = input.required<string>();
  exit = output<void>();

  protected timeString = computed(() =>
    this.rawNotes().match(/#time-(.+)\s/)?.[1]);
  protected fontSize = signal<number>(undefined);

  protected heading = computed(() => {
    const notes = this.notes();
    const slideStep = this.currentSlideStep();
    if (!notes || !slideStep || !isArray(slideStep)) {
      return;
    }
    const key = slideStep[0];
    const note = notes[tagSlide + key];
    return note ? `${key}: ${note.name}` : `Error: No notes for [${key}]`;
  });

  protected currentIndex = computed(() =>
    parseInt(this.currentSlideStep()[1] ?? '0'));

  protected currentSlide = computed(() => {
    let notes = this.notes();
    let slideStep = this.currentSlideStep();
    if (!notes || !slideStep || !isArray(slideStep)) {
      return;
    }

    return notes[tagSlide + slideStep[0]];
  });

  private notes = computed<{} | null>(() => {
    let script = this.rawNotes();
    if (!script) return;

    const scriptTrimmed = script.trim();
    const timeString = scriptTrimmed.match(/#time-(.+)\s/)?.[1];

    const timeDefinition = timeString?.length ?? 0;
    const scriptNoTime = scriptTrimmed.slice(timeDefinition);

    const notes = scriptNoTime.split(tagSlide)
      .filter(s => s && s.trim() !== sep)
      .map(section => {
        let [index, ...notTag] = section.split(' ');
        let key = tagSlide + index;
        let [name, ...notName] = notTag.join(' ').trim().split(sep);

        let steps = notName.join(sep).trim().split(tagStep)
          .map(content => content.trim()
            .replaceAll(sep + sep, sep)
            .replaceAll(sep, '<br/>'),
          );

        return [key, {name, steps}];
      });

    return Object.fromEntries(notes);
  });

}
