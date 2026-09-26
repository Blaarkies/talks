import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WINDOW_INNER_HEIGHT_RESIZED } from '@app/common';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { FilmRoll } from '@talk/regex/component/film-roll/film-roll';
import { FilmShot } from '@talk/regex/component/film-roll/type';
import { Definition } from '@talk/regex/slide/history/film-shot/definition/definition';
import { ExampleInApp } from '@talk/regex/slide/history/film-shot/example-in-app/example-in-app';
import { Implementation } from '@talk/regex/slide/history/film-shot/implementation/implementation';
import { ModernRegex } from '@talk/regex/slide/history/film-shot/modern-regex/modern-regex';
import { Origin } from '@talk/regex/slide/history/film-shot/origin/origin';
import {
  map,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-slide-history',
  imports: [FilmRoll],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideHistory {

  protected isResizing = inject(WINDOW_INNER_HEIGHT_RESIZED);

  protected filmShots: FilmShot[] = [
    {component: Origin, theme: 'sepia'},
    {component: Implementation, theme: 'paper'},
    {component: Definition, theme: 'paper'},
    {component: ModernRegex},
    {component: ExampleInApp},
  ];

  protected beginAnimation = toSignal(timer(1500).pipe(map(() => true)));

  protected step = inject(ClickerService)
    .makeSafeStepperSignal(this.filmShots.length - 1);


  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(2, this.step()));
  }

}
