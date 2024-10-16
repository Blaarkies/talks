import {
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  coerceBetween,
  isArray,
  sep,
} from '../../common';
import { ButtonComponent } from '../../common/component/button/button.component';
import { PaneComponent } from '../../common/component/pane/pane.component';
import { PresenterNotesService } from './presenter-notes.service';

let tagSlide = '#slide-';
let tagStep = '>';

@Component({
  selector: 'app-presenter-notes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PaneComponent,
    ButtonComponent,
  ],
  templateUrl: './presenter-notes.component.html',
  styleUrl: './presenter-notes.component.scss',
})
export class PresenterNotesComponent {

  protected lastUsedScript = signal<string | null>(null);
  protected inputNotesScript = model<string>();
  protected heading = computed(() => {
    let notes = this.notes();
    let slideStep = this.currentSlideStep();
    if (!notes || !slideStep || !isArray(slideStep)) {
      return;
    }
    let key = slideStep[0];
    return `${key}: ${notes[tagSlide + key].name}`;
  });

  protected currentNotes = computed(() => {
    let slide = this.currentSlide();
    let slideStep = this.currentSlideStep();
    if (!slide || !slideStep || !isArray(slideStep)) {
      return;
    }

    let i = parseInt(slideStep[1]);
    return slide.steps.slice(
      coerceBetween(i - 1, 0, slide.steps.length),
      i + 2);
  });
  protected currentStep = computed(() => {
    let i = parseInt(this.currentSlideStep()[1] ?? '0');
    return this.currentSlide().steps[i];
  });

  private currentSlide = computed(() => {
    let notes = this.notes();
    let slideStep = this.currentSlideStep();
    if (!notes || !slideStep || !isArray(slideStep)) {
      return;
    }

    return notes[tagSlide + slideStep[0]];
  });

  private notes = computed<{} | null>(() => {
    let script = this.inputNotesScript();
    if (!script) {
      return;
    }

    let scriptTrimmed = script.trim();
    let slides = scriptTrimmed.slice();
    let notes = slides.trim().split(tagSlide)
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

  private presenterNotesService = inject(PresenterNotesService);
  private currentSlideStep = this.presenterNotesService.slideStep;

  constructor() {
    let lastUsedScript = this.presenterNotesService.getLastUsedScript();
    this.lastUsedScript.set(lastUsedScript);

    if (lastUsedScript) {
      this.inputNotesScript.set(lastUsedScript);
    }

    effect(() => {
      let newScript = this.inputNotesScript();
      if (!newScript) {
        return;
      }
      this.presenterNotesService.saveNewScript(newScript);
      this.lastUsedScript.set(newScript);
    }, {allowSignalWrites: true});
  }

}
