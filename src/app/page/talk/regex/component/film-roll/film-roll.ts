import {
  NgComponentOutlet,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  viewChild,
  viewChildren,
} from '@angular/core';
import { lerp } from '@app/common';
import { FilmShot } from '@talk/regex/component/film-roll/type';

@Component({
  selector: 'app-film-roll',
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
  ],
  templateUrl: './film-roll.html',
  styleUrl: './film-roll.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmRoll {

  filmShots = input.required<FilmShot[]>();
  index = input.required<number>();

  private roller = viewChild<ElementRef<HTMLDivElement>>('roller');
  private projectionItems = viewChildren
    < ElementRef < HTMLDivElement >> ('projectionItem');

  protected itemHeight = computed(() =>
    this.roller().nativeElement.offsetHeight);

  private spaceAboveMap = computed(() => {
    const items = this.projectionItems().map(c => c.nativeElement);
    const spaceMap = new Map<typeof items[0], number>();
    if (!items[0]) {
      return spaceMap;
    }

    const elements = Array.from(items[0].parentElement.children);
    const heights = elements.map((e: HTMLElement) =>
      ({e, height: e.offsetHeight}));

    for (const item of items) {
      const index = elements.indexOf(item);
      const totalHeight = heights.slice(0, index)
        .reduce((sum, c) => sum + c.height, 0);
      spaceMap.set(item, totalHeight);
    }

    return spaceMap;
  });

  constructor() {
    const bounceTimingFn = 'cubic-bezier(0.03, -0.54, 0.48, 1.42)';
    let oldOffset = 0;
    let firstRun = true;

    effect(async () => {
      const rollerElement = this.roller().nativeElement;
      const index = this.index();
      const items = this.projectionItems();
      const spaceAboveMap = this.spaceAboveMap();
      if (!rollerElement || !items.length) {
        return;
      }

      const nextOffset = this.getItemOffset(
        spaceAboveMap, items[index].nativeElement, rollerElement);

      const detourOffset = firstRun
                           ? rollerElement.offsetHeight
                           : lerp(nextOffset / 2, nextOffset, Math.random());
      const detourDuration = firstRun
                             ? 500
                             : lerp(100, 300, detourOffset / nextOffset);

      await this.rollFromTo(rollerElement, oldOffset, detourOffset,
        'ease-in', detourDuration);
      await this.rollFromTo(rollerElement, detourOffset, nextOffset,
        bounceTimingFn);

      oldOffset = nextOffset;
      firstRun = false;
    });
  }

  private rollFromTo(
    rollerElement: HTMLDivElement,
    oldOffset: number,
    nextOffset: number,
    easing: string,
    duration = 1e3)
    : Promise<void> {
    const animation = rollerElement.animate({
      translate: [`0 ${-oldOffset}px`, `0 ${-nextOffset}px`],
    }, {
      duration,
      easing,
      fill: 'both',
    });

    const {promise, resolve} = Promise.withResolvers<void>();
    const cont = new AbortController();
    animation.addEventListener('finish', () => {
      cont.abort();
      resolve();
    }, {signal: cont.signal});

    return promise;
  }

  private getItemOffset(spaceAboveMap: ReturnType<typeof this.spaceAboveMap>,
                        itemElement: HTMLDivElement,
                        rollerElement: HTMLDivElement) {
    const spaceAbove = spaceAboveMap.get(itemElement);
    const centeringOffset = (itemElement.offsetHeight - rollerElement.offsetHeight) / 2;
    return spaceAbove + centeringOffset;
  }
}
