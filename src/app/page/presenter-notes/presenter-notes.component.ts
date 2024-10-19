import {
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  map,
  switchMap,
  timer,
} from 'rxjs';
import {
  coerceBetween,
  isArray,
  sep,
} from '../../common';
import { ButtonComponent } from '../../common/component/button/button.component';
import { PaneComponent } from '../../common/component/pane/pane.component';
import { ProgressComponent } from '../../common/component/progress/progress.component';
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
    ProgressComponent,
  ],
  templateUrl: './presenter-notes.component.html',
  styleUrl: './presenter-notes.component.scss',
})
export class PresenterNotesComponent {

  protected maxSecondsAllowed = signal(60 * 30);
  protected maxMinutesAllowed = computed(() =>
    Math.floor(this.maxSecondsAllowed() / 60));

  private timeMark = signal(Date.now());

  protected elapsedSeconds = toSignal(
    toObservable(this.timeMark).pipe(
      switchMap(() => timer(0, 7e3)),
      map(() => {
        let elapsedTicks = Date.now() - this.timeMark();
        return elapsedTicks / 1000;
      })));

  protected timeElapsed = computed(() => {
    let elapsedSeconds = this.elapsedSeconds();
    let hours = elapsedSeconds / 3600;
    let minutes = (elapsedSeconds / 60) % 60;

    let f = (n: number, u: string, significant = false) => {
      let measure = ` ${Math.floor(n).toString().padStart(2)}${u}`;
      return significant
             ? `<strong>${measure}</strong>`
             : `<span>${measure}</span>`;
    };

    return `${f(hours, 'h')}${f(minutes, 'm', true)}`;
  });

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

      this.resetTimer();
    }, {allowSignalWrites: true});
  }

  protected resetTimer() {
    this.timeMark.set(Date.now());
  }

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

    this.inputNotesScript.set(text);
  }

  protected setNewTimeLimit(e: MouseEvent) {
    let elementBar = e.target as HTMLElement;

    let widthSelected = e.layerX;
    let widthMax = elementBar.clientWidth;

    let proportion = widthSelected / widthMax;

    let minutes60 = 60 * 60;
    let value = Math.floor(proportion * minutes60);
    this.maxSecondsAllowed.set(value);
  }
}
