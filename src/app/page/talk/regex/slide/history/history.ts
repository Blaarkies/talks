import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { WA_WINDOW } from '@ng-web-apis/common';
import { FilmRoll } from '@talk/regex/component/film-roll/film-roll';
import { FilmShot } from '@talk/regex/component/film-roll/type';
import { Definition } from '@talk/regex/slide/history/film-shot/definition/definition';
import { Implementation } from '@talk/regex/slide/history/film-shot/implementation/implementation';
import { ModernRegex } from '@talk/regex/slide/history/film-shot/modern-regex/modern-regex';
import { Origin } from '@talk/regex/slide/history/film-shot/origin/origin';
import {
  concatMap,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  of,
  startWith,
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

  private window = inject(WA_WINDOW);

  // Going fullscreen breaks app-film-roll, because projection items are forced
  // to the current viewport height.
  // Detect resize events, destroy app-film-roll, wait, then render a new one
  protected isResizing = toSignal(
    fromEvent(this.window, 'resize').pipe(
      map(() => this.window.innerHeight),
      distinctUntilChanged(),
      concatMap(() => merge(
        timer(0).pipe(map(() => false)),
        of(true),
      )),
      startWith(false),
    ),
  );

  protected filmShots: FilmShot[] = [
    {component: Origin, theme: 'sepia'},
    {component: Implementation, theme: 'paper'},
    {component: Definition, theme: 'paper'},
    {component: ModernRegex},
  ];

  protected beginAnimation = toSignal(timer(1500).pipe(map(() => true)));

  protected step = inject(ClickerService)
    .makeSafeStepperSignal(this.filmShots.length - 1);


}
