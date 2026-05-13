import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import { coerceBetween } from '@app/common';
import { Pixelator } from '@talk/regex/component/pixelator/pixelator';

@Component({
  selector: 'app-pixelation-book',
  imports: [
    NgTemplateOutlet,
    Pixelator,
  ],
  templateUrl: './pixelation-book.html',
  styleUrl: './pixelation-book.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixelationBook {

  activeIndex = input(0);

  private pixelatorA = viewChild('pixelatorA', {read: Pixelator});
  private pixelatorB = viewChild('pixelatorB', {read: Pixelator});

  private pages = contentChildren<TemplateRef<HTMLElement>>(TemplateRef);

  private safeIndex = computed(() => {
    const max = this.pages().length - 1;
    const index = this.activeIndex();
    const safe = coerceBetween(index, 0, max);
    if (safe !== index) {
      throw new Error(
        `Out of bounds error. ContentChild at index [${index}]`
        + ` does not exist`);
    }
    return safe;
  });

  protected newPage = computed(() => this.pages()[this.safeIndex()]);

  protected pageA = signal<TemplateRef<HTMLElement>>(undefined);
  protected pageB = signal<TemplateRef<HTMLElement>>(undefined);

  constructor() {
    let bucket = -1;

    toObservable(this.newPage).pipe(takeUntilDestroyed())
      .subscribe(page => {
        bucket = ++bucket % 2;

        const a = this.pixelatorA();
        const b = this.pixelatorB();
        const delay = 1000;

        if (bucket === 0) {
          this.pageA.set(page);

          a.config({direction: 'in', delay: 0});
          a.pixelate({immediate: !this.pageB()});

          b.config({direction: 'out', delay});
          b.pixelate();
        } else {

          this.pageB.set(page);

          a.config({direction: 'out', delay});
          a.pixelate();

          b.config({direction: 'in', delay: 0});
          b.pixelate();
        }
      });
  }

}
