import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
import {
  PaneComponent,
  ThemeNumberAny,
} from '@component/pane/pane.component';

type PaneValue = {
  header: string
  type: ThemeNumberAny
  swap: boolean
  index: number
}

@Component({
  selector: 'app-reading',
  imports: [
    PaneComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './reading.html',
  styleUrl: './reading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Reading {

  private step = inject(ClickerService).makeSafeStepperSignal(4);
  private duration = 1.7e3;

  private paneA = viewChild('paneA', {read: ElementRef});
  private paneAElement = computed(() =>
    this.paneA().nativeElement as HTMLDivElement);

  private paneB = viewChild('paneB', {read: ElementRef});
  private paneBElement = computed(() =>
    this.paneB().nativeElement as HTMLDivElement);

  private headers = [
    'Find the outer frame and flags',
    'Break up groups',
    'Branching logic',
    'Replace with plain language',
    'A regex pattern is not read as a sentence',
  ];

  protected paneAValues = signal(this.getStepValues(1));
  protected paneBValues = signal(this.getStepValues(0));

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(8, this.step()));

    let previous = this.step();
    effect(() => {
      const elementA = this.paneAElement();
      const elementB = this.paneBElement();
      if (!elementA || !elementB) return;

      const step = this.step();

      if (step === previous) {
        elementA.animate({clipPath: 'xywh(0 0 0 0)'}, {
          duration: 1,
          fill: 'both',
        });
        return;
      }

      const duration = this.duration;
      const fill = 'both';
      const easeCount = 12;
      const easing = `steps(${easeCount - 1})`;
      const d: KeyframeAnimationOptions = {duration, fill, easing};
      const delay = 2 * duration / easeCount ** 2;

      // Mask rectangle. Starts with element in full frame, then pans right,
      // leaving element out of view from the left
      const inOutList = [
        {clipPath: 'xywh(-10% 0 110% 110%)'},
        {clipPath: 'xywh(120% 0 110% 110%)'},
      ];

      // Starts out of frame on the left, pans right into center of element,
      // bringing element into frame
      const outInList = [
        {clipPath: 'xywh(-120% 0 110% 110%)'},
        {clipPath: 'xywh(-10% 0 110% 110%)'},
      ];

      const forward = step > previous;
      if (forward) {
        this.paneAValues.set(this.getStepValues(previous));
        this.paneBValues.set(this.getStepValues(step));

        elementA.animate(inOutList, d);
        elementB.animate(outInList, {...d, delay});
      } else {
        this.paneAValues.set(this.getStepValues(step));
        this.paneBValues.set(this.getStepValues(previous));

        elementA.animate(inOutList.toReversed(), {...d, delay});
        elementB.animate(outInList.toReversed(), d);
      }

      previous = step;
    });
  }

  private getStepValues(index: number): PaneValue {
    return {
      header: this.headers[index],
      type: (1 + index % 5) as PaneValue['type'],
      swap: index % 3 < 1,
      index,
    };
  }


}