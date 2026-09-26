import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { PaneComponent } from '@component/pane/pane.component';
import { ProgressComponent } from '@component/progress/progress.component';
import {
  map,
  switchMap,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-timer',
  imports: [
    PaneComponent,
    ProgressComponent,
  ],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer {

  timeString = input.required<string>();

  /** Each scripts starts with an allocated time string.
   * Parse this to find the numerical time */
  protected maxSecondsAllowed = linkedSignal(() => {
    const [_, h, m, s] = this.timeString()
      .match(/(\d+h)?(\d+m)?(\d+s)?/)
    ?? [];

    const seconds =
      Number(s?.slice(0, -1) ?? 0)
      + Number(m?.slice(0, -1) ?? 0) * 60
      + Number(h?.slice(0, -1) ?? 0) * 3600;

    return seconds || (60 * 30);
  });

  protected maxMinutesAllowed = computed(() =>
    Math.floor(this.maxSecondsAllowed() / 60));

  /** Timestamp indicating the last timer reset */
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

  protected resetTimer() {
    this.timeMark.set(Date.now());
  }

  /** Sets a custom time limit determined from the click position */
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
