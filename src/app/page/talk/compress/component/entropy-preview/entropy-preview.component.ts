import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  debounceTime,
  filter,
  Subject,
} from 'rxjs';
import { findNumberGaps } from '../../../../../common';
import { ButtonComponent } from '../../../../../common/component/button/button.component';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import {
  Data,
  TokenElementGroup,
} from '../../common';
import { EntropyMeasureComponent } from '../entropy-measure/entropy-measure.component';

@Component({
  selector: 'app-entropy-preview',
  standalone: true,
  imports: [
    PaneComponent,
    EntropyMeasureComponent,
    ButtonComponent,
  ],
  templateUrl: './entropy-preview.component.html',
  styleUrl: './entropy-preview.component.scss',
})
export class EntropyPreviewComponent {

  header = input<string>();
  data = input.required<Data>();

  type = input<1 | 2 | 3 | 4>(1);

  private previewDataElement = viewChild('previewData', {read: ElementRef<HTMLElement>});

  protected text = computed(() => {
    let data = this.data();
    if (!data) {
      return [];
    }

    if (typeof data === 'string') {
      return data.match(this.regexWordsSpacesMarks);
    }

    return [];
  });
  protected encodedTokens = computed(() => {
    let refs = this.tokensRefs();
    return refs.map(refEntry => {
      let [t, r] = refEntry;
      return {refEntry, label: `${this.tokenSymbol}${r} ${t}`};
    });
  });
  protected totalBytes = computed(() =>
    this.previewDataElement().nativeElement.textContent.length
    + this.encodedTokens().map(r => r.label.substring(1))
      .join('').replaceAll(' ', '').length);

  private tokensElementsMap = new Map<string, HTMLElement[]>();
  private tokensRefsMap = new Map<string, number>();
  private tokensRefs = signal<(string | number)[][]>([]);

  private regexWordsSpacesMarks = /\b\w+\b|./g;
  private tokenSymbol = '@';
  private isSelectedClassName = 'is-selected';
  private activeAnimations: Animation[] = [];

  private wordHover$ = new Subject<TokenElementGroup>();
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => this.wordHover$.complete());

    this.wordHover$.subscribe(() =>
      this.activeAnimations.forEach(a => a.cancel()));

    this.wordHover$.pipe(
      debounceTime(200),
      filter(v => v !== null))
      .subscribe(v => this.wordHover(v.eventTarget, v.parentElement));
  }

  triggerWordHover(eventTarget?: EventTarget, parentElement?: HTMLDivElement) {
    if (!eventTarget || !parentElement) {
      this.wordHover$.next(null);
      return;
    }
    this.wordHover$.next({eventTarget, parentElement});
  }

  private wordHover(eventTarget: EventTarget, parentElement: HTMLDivElement) {
    if (!(eventTarget instanceof HTMLElement)) {
      return;
    }
    let wordElement = eventTarget as HTMLElement;
    let token = wordElement.getAttribute('data-token');
    this.cacheTokenElements(token, parentElement);

    this.activeAnimations.forEach(a => a.cancel());
    this.tokensElementsMap.get(token)
      .forEach(e => {
        if (e === eventTarget) {
          return;
        }
        let animation = e.animate({background: 'var(--base-color-11)'},
          {
            duration: 400,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'steps(3)',
          });
        this.activeAnimations.push(animation);
      });

    if (this.tokensElementsMap.get(token).length === 1) {
      let animation = eventTarget.animate({background: 'var(--base-color-9)'},
        {
          duration: 400,
          iterations: 4,
          direction: 'alternate',
          easing: 'steps(4)',
        });
      this.activeAnimations.push(animation);
    }
  }

  private cacheTokenElements(token: string, parentElement: HTMLDivElement) {
    if (!this.tokensElementsMap.has(token)) {
      let safeToken = token === '"' ? '\\"' : token;
      this.tokensElementsMap.set(token, Array.from(
        parentElement.querySelectorAll(`span[data-token="${safeToken}"]`)));
    }
  }

  wordClick(eventTarget: EventTarget, parentElement: HTMLDivElement) {
    if (!(eventTarget instanceof HTMLElement)) {
      return;
    }
    let wordElement = eventTarget as HTMLElement;
    let token = wordElement.getAttribute('data-token');

    this.toggleToken(token, parentElement);
  }

  private toggleToken(token: string, parentElement?: HTMLDivElement) {
    let tokenRef = this.getAvailableToken();
    let nowState = this.tokensRefsMap.delete(token)
      || !this.tokensRefsMap.set(token, tokenRef);

    this.tokensRefs.set(
      Array.from(this.tokensRefsMap.entries())
        .sort(([, a], [, b]) => a - b),
    );

    let isActive = !nowState;
    if (parentElement) {
      this.cacheTokenElements(token, parentElement);
    }

    this.tokensElementsMap.get(token)
      .forEach(e => {
        if (isActive) {
          e.classList.add(this.isSelectedClassName);
          e.innerHTML = this.tokenSymbol + tokenRef;
        } else {
          e.classList.remove(this.isSelectedClassName);
          e.innerHTML = token;
        }
      });
    this.activeAnimations.forEach(a => a.cancel());
  }

  removeEncoding(refEntry: (string | number)[]) {
    let token = refEntry[0] as string;
    this.toggleToken(token);
  }

  clearTokens() {
    this.tokensElementsMap.forEach((v, k) =>
      v.forEach(e => {
        e.classList.remove(this.isSelectedClassName);
        e.innerHTML = k;
      }));

    this.tokensRefsMap.clear();
    this.tokensRefs.set([]);
    this.activeAnimations.forEach(a => a.cancel());
  }

  private getAvailableToken(): number {
    let tokenNumbers = this.tokensRefs().map(([, n]) => n as number);
    // add -1 to ensure 0 is a valid min number
    let allNumbers = [-1].concat(tokenNumbers);
    let availables = findNumberGaps(allNumbers);

    return availables.length
           ? availables[0]
           : Math.max(...allNumbers) + 1;
  }

}
