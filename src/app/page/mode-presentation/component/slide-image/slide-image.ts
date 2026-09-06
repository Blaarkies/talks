import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  fromEvent,
  map,
  sampleTime,
  startWith,
} from 'rxjs';

@Component({
  selector: 'app-slide-image',
  imports: [],
  templateUrl: './slide-image.html',
  styleUrl: './slide-image.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideImage {

  imageSource = input.required<string>();
  forceFullScreen = input<boolean>(true);
  protected fullScreen = computed(() => this.forceFullScreen() !== false);

  private window = inject(WA_WINDOW);
  private resize$ = fromEvent(this.window, 'resize')
    .pipe(
      sampleTime(50),
      startWith(0),
      map(() => ({
        width: this.window.innerWidth,
        height: this.window.innerHeight,
      }))
    );

  protected dimensions = toSignal(this.resize$);

}
