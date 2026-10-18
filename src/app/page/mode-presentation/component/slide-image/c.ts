import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ExtractInputs} from '@app/common/type/extract-signal-input';
import {
  Clicker,
  SlideName,
} from '@app/page/mode-presentation/service/clicker';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  fromEvent,
  map,
  sampleTime,
  startWith,
} from 'rxjs';

export type SlideImageData = ExtractInputs<SlideImage,
  | 'imageSource'
  | 'slideName'
>

@Component({
  selector: 'app-slide-image',
  imports: [],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideImage {

  imageSource = input.required<string>();
  slideName = input.required<SlideName>();
  forceFullScreen = input<boolean>(true);
  style = input<Partial<CSSStyleDeclaration>>();

  protected fullScreen = computed(() => this.forceFullScreen() !== false);

  private window = inject(WA_WINDOW);
  private resize$ = fromEvent(this.window, 'resize')
    .pipe(
      sampleTime(50),
      startWith(0),
      map(() => ({
        width: this.window.innerWidth,
        height: this.window.innerHeight,
      })),
    );

  protected dimensions = toSignal(this.resize$);

  constructor() {
    const clickerService = inject(Clicker);
    toObservable(this.slideName).pipe(takeUntilDestroyed())
      .subscribe(name => clickerService.registerSlide(name, 0));
  }

}
