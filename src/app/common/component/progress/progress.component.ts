import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { sampleTime } from 'rxjs';
import { chars } from '../../char';
import { coerceBetween } from '../../function';
import { SHARED_RESIZE_OBSERVER } from '../../token';

@Component({
  selector: 'app-progress',
  standalone: true,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {

  value = input<number>();

  private pxToCh = viewChild<ElementRef<HTMLSpanElement>>('pxToCh');

  private self = inject(ElementRef);
  private resizeObserver = inject(SHARED_RESIZE_OBSERVER);

  private resizeObservation = toSignal(this.resizeObserver
    .observe(this.self.nativeElement)
    .pipe(sampleTime(50)));

  private pxToChElement = computed(() => this.pxToCh()?.nativeElement);

  private totalCharsInBar = computed(() => {
    this.resizeObservation();
    let element = this.pxToChElement();
    if (!element) {
      return 0;
    }

    let pxToChConversion = element.offsetWidth;
    return Math.floor(
      this.self.nativeElement.clientWidth * 100 / pxToChConversion);
  });

  protected valueInChars = computed(() => {
    let total = this.totalCharsInBar();

    let value = this.value();
    if (!value && value !== 0) {
      return;
    }

    let valueCoerced = coerceBetween(value, 0, 1);
    let valueCutoff = total * valueCoerced;

    let result = [];
    for (let i = 0; i < total; i++) {
      result.push(i < valueCutoff ? chars.square3 : chars.square1);
    }

    return result.join('');
  });

}
