import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  TemplateRef,
} from '@angular/core';
import { makeNumberList } from '@app/common';

/** Container that manages morph animations on the provided template refs
 * when `currentIndex` updates.
 * Uses svg feMorphology SMIL animation (erode, dilate)
 * @example
 *   <app-book [currentIndex]="step()">
 *     <ng-template>
 *       My content or component
 *     </ng-template>
 *   </app-book>
 */
@Component({
  selector: 'app-book',
  templateUrl: './book.html',
  imports: [
    NgTemplateOutlet,
  ],
  styleUrls: ['book.scss'],
})
export class BookComponent {
  private self = inject(ElementRef<HTMLElement>);

  dilateRadius = input(15);
  erodeRatio = input(2.7);
  duration = input(1.5e3);
  currentIndex = input<number>();

  protected pages = contentChildren<TemplateRef<HTMLElement>>(TemplateRef);
  protected animators = linkedSignal(() => {
    const e = this.erodeRadius();
    return this.pages()
      .map((_, id) => ({
        id, dur: `1ms`,
        dilateValues: '0',
        erodeValues: `${e}`,
      }));
  });

  protected erodeRadius = computed(() =>
    this.dilateRadius() * this.erodeRatio());

  private previousIndex: number;

  private stepsCount = 7;
  private indexCount = this.stepsCount - 1;

  constructor() {
    effect(() => {
      const c = this.currentIndex();
      this.playAnimationIn(c);

      const p = this.previousIndex;
      this.previousIndex = c;
      if (p === undefined) return;

      this.playAnimationOut(p);
    });
  }

  private playAnimationIn(i: number) {
    const d = this.dilateRadius();

    const ds = makeNumberList(this.stepsCount).map(n => {
      const norm = n/this.indexCount;
      return d * norm;
    }).slice(1);
    const dFull = ds.concat(ds.slice(0, -1).toReversed());

    const e = this.erodeRadius();
    const es = makeNumberList(this.stepsCount).map(n => {
      const norm = n/this.indexCount;
      return e * norm;
    }).slice(1).toReversed();

    this.animators.update(a => {
      a[i] = {
        id: a[i].id,
        dur: `${this.duration()}ms`,
        dilateValues: `0;${dFull.join(';')};0`,
          // `0;${this.dilateRadius()};0`,
        erodeValues: `${es.join(';')};0`,
          // `${this.erodeRadius()};0`,
      };
      return a;
    });
    this.runAnimation(i);
  }

  private playAnimationOut(i: number) {
    const e = this.erodeRadius();
    const es = makeNumberList(this.stepsCount).map(n => {
      const norm = n/this.indexCount;
      return e * norm * .4;
    }).slice(1);
    const eFull = es.concat(es.slice(0, -1).toReversed());

    const d = this.dilateRadius();
    const ds = makeNumberList(this.stepsCount).map(n => {
      const norm = n/this.indexCount;
      return d * norm * .5;
    }).slice(1,-1);

    this.animators.update(a => {
      a[i] = {
        id: a[i].id,
        dur: `${this.duration()}ms`,
        dilateValues: `0;${ds.join(';')}`,
          // `0;${this.dilateRadius()}`,
        erodeValues: `0;${eFull.join(';')};${e}`,
          // `0;${e * .2};${e}`,
      };
      return a;
    });
    this.runAnimation(i);
  }

  private runAnimation(i: number) {
    const d = this.querySelector<SVGAnimateElement>(`#dilate-${i}`);
    const e = this.querySelector<SVGAnimateElement>(`#erode-${i}`);
    d?.beginElement();
    e?.beginElement();
  }

  private querySelector<T>(selector: string): T | null {
    return this.self.nativeElement.querySelector(selector);
  }

}
