import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  concatMap,
  map,
  of,
  startWith,
  timer,
} from 'rxjs';
import {
  coerceBetween,
  makeNumberList,
  sep,
} from '../../../../../common';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';
import { splitStringToRunLengthEncoding } from '../../common/encode';
import { EntropyMeasureComponent } from '../../component/entropy-measure/entropy-measure.component';
import { RunLengthDefinitionComponent } from '../../component/run-length-definition/run-length-definition.component';
import { RunLengthPreviewComponent } from '../../component/run-length-preview/run-length-preview.component';
import { hexagonImage } from '../../data/run-length-image';

const stepTimings = [0, 3e3, 2.5e3, 1e3, 2e3, 2e3];

@Component({
  selector: 'app-slide-run-length-encoding',
  standalone: true,
  imports: [
    RunLengthPreviewComponent,
    RunLengthDefinitionComponent,
    EntropyMeasureComponent,
  ],
  templateUrl: './slide-run-length-encoding.component.html',
  styleUrl: './slide-run-length-encoding.component.scss',
})
export class SlideRunLengthEncodingComponent {

  private previewData = viewChild('previewData',
    {read: ElementRef<HTMLElement>});
  private previewMeasure = viewChild('previewMeasure',
    {read: ElementRef<HTMLElement>});

  private defsData = viewChild('defsData',
    {read: ElementRef<HTMLElement>});
  private defsMeasure = viewChild('defsMeasure',
    {read: ElementRef<HTMLElement>});

  protected step = toSignal(of(...makeNumberList(5, 1)).pipe(
    concatMap(n => timer(stepTimings[n] ?? 3e3).pipe(map(() => n))),
    startWith(0),
  ));

  protected imageString = signal(hexagonImage).asReadonly();
  protected imageStringPixelsOnly = computed(() =>
    this.imageString().replaceAll('\n', ''));
  protected imageWidth = signal(hexagonImage.indexOf(sep)).asReadonly();

  protected encodings = computed(() => {
    let imageString = this.imageString();
    if (!imageString) {
      return;
    }
    let runLines = splitStringToRunLengthEncoding(imageString);
    return runLines.map(l => [l.length, l[0]]);
  });

  protected encodingsData = computed(() => this.encodings()
      .map(([n, c]) => `${n}${c}`)
      .join('')
    // stride info prepended to header. it should also be measured
    + this.imageWidth() + 'W');

  protected litDef = signal<number | null>(null);
  protected litPreview = signal<number | null>(null);

  constructor() {
    let presenterStep = signal(0);
    let presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(3, presenterStep()));
    inject(ClickerService).stepAction$.pipe(takeUntilDestroyed())
      .subscribe(a => presenterStep.update(n => {
        let difference = a === 'right' ? 1 : -1;
        return coerceBetween(n + difference, 0, 2);
      }));

    effect(() => {
      let imageString = this.imageString();
      if (!imageString || this.step() !== 1) {
        return;
      }
      let element = this.previewData().nativeElement;
      let maxX = imageString.indexOf(sep);
      let maxY = imageString.split('').filter(c => c === sep).length;
      this.animateFeed(element, maxX, maxY, 2e3);
    });

    effect(() => {
      if (this.step() !== 2) {
        return;
      }
      this.animateFeed(this.previewMeasure().nativeElement, 10, 3, 1e3);
    });

    effect(() => {
      if (this.step() !== 4) {
        return;
      }
      this.animateFeed(this.defsData().nativeElement, 25, 4, 1500);
    });

    effect(() => {
      if (this.step() !== 5) {
        return;
      }
      this.animateFeed(this.defsMeasure().nativeElement, 5, 2, 1e3);
    });
  }

  protected previewPointing(index: number) {
    this.litDef.set(index);
  }

  protected definitionsPointing(index: number) {
    this.litPreview.set(index);
  }

  private animateFeed(element: HTMLElement,
                      maxX: number,
                      maxY: number,
                      duration: number) {
    let frames = [[3, 0], [7, 0], [16, 0]].concat(
      makeNumberList(8, 2)
        .map(n => Math.pow(n, 1.4))
        .filter(n => n <= maxY)
        .map(n => [(n * 5) % maxX, n / 10 * maxY]),
    )
      .map(([x, y]) => {
        let xp = (100 * x / maxX) + '%';
        let yp1 = (100 * y / maxY) + '%';
        let yp2 = (100 * (y + 1) / maxY) + '%';

        return `polygon(0 0, 100% 0, 
100%  ${yp1}, 
${xp} ${yp1},
${xp} ${yp2}, 
0%    ${yp2})`
          .replace(/\s+/g, ' ');
      })
      .map(p => ({clipPath: p} as Keyframe));

    element.animate(frames, {
      duration,
      easing: `steps(${Math.round(duration / 200)})`,
    });
  }
}
