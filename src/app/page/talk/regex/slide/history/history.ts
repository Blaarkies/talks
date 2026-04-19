import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { coerceBetween } from '@app/common';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { FilmRoll } from '@talk/regex/component/film-roll/film-roll';
import { FilmShot } from '@talk/regex/component/film-roll/type';
import { Definition } from '@talk/regex/slide/history/film-shot/definition/definition';
import { Implementation } from '@talk/regex/slide/history/film-shot/implementation/implementation';
import { ModernRegex } from '@talk/regex/slide/history/film-shot/modern-regex/modern-regex';
import { Origin } from '@talk/regex/slide/history/film-shot/origin/origin';
import {
  map,
  scan,
  startWith,
  timer,
} from 'rxjs';

// who started it.
// implementations grep sed awk
// what it is. what it is not.
// where do YOU find it.

@Component({
  selector: 'app-slide-history',
  imports: [
    FilmRoll,
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideHistory {

  protected filmShots: FilmShot[] = [
    {component: Origin, theme: 'sepia'},
    {component: Implementation, theme: 'paper'},
    {component: Definition, theme: 'paper'},
    {component: ModernRegex},
  ];

  protected beginAnimation = toSignal(timer(1500).pipe(map(() => true)));

  protected step = toSignal(inject(ClickerService).stepAction$
    .pipe(
      startWith(null),
      scan((acc, value) => {
        const asNumber = value === 'left'
                         ? -1 : value === 'right'
                                ? 1 : 0;
        const safeStep = coerceBetween(asNumber + acc,
          0, this.filmShots.length - 1);
        return safeStep;
      }, 0)),
  );

}
