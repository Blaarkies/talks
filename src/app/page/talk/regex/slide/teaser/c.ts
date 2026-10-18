import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  coerceAtLeast,
  makeNumberList,
} from '@app/common';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { Clicker } from '@app/page/mode-presentation/service/clicker';
import { getSizedMockText } from '@talk/regex/common/mock-text';
import { TempoGenerator } from '@talk/regex/slide/teaser/tempo-generator';
import {
  MatchedWord,
  LightableContent,
  MatchedCategory,
} from '@talk/regex/slide/teaser/type';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  debounceTime,
  filter,
  map,
  mergeWith,
  sampleTime,
  startWith,
  Subject,
  takeUntil,
  takeWhile,
  tap,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-slide-teaser',
  imports: [
    PaneComponent,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideTeaser {

  protected step = inject(Clicker).registerSlide(1, 1);

  private bufferLines = 5; // total lines on screen at a time
  private book = getSizedMockText(80).replaceAll('\n\n', '\n') + ' ';
  private maxIndex = this.book.length;
  private eolPositions = this.book.matchAll(/\n/g).toArray().map(m => m.index);

  private allMatches: MatchedWord[];
  private allSections: LightableContent[];
  private allGroups: Record<string, MatchedWord[]>;

  private ledgerMatches = computed(() => {
    const index = this.index();
    return this.allMatches
      .filter(({m}) => m.index + m[1].length < index)
      .map(({m, title}) => ({m: m[1], title}));
  });

  protected categories = computed(() => {
    const ledgerMatches = this.ledgerMatches();
    const ledgersMatchMap = Object.groupBy(ledgerMatches, ({m}) => m);
    const ledgersGroupMap = Object.groupBy(ledgerMatches, ({title}) => title);

    return Object.entries(this.allGroups).map(([k, v]) => (<MatchedCategory>{
      title: k,
      matches: v.map(m => {
        const label = m.m[1];
        return {label, hide: !ledgersMatchMap[label]};
      }),
      hide: !ledgersGroupMap[k],
    }));
  });

  protected hideLedger = computed(() => !this.categories().some(c => !c.hide));

  private pauseIndex$ = new Subject<number>();
  private tempoGenerator = new TempoGenerator({
    maxIndex: this.maxIndex,
    start: 1,
    destroyRef: inject(DestroyRef),
  });
  private index$ = this.tempoGenerator.index$.pipe(
    startWith(0),
    filter(() => this.step() === 0),
    startWith(this.book.length),
    mergeWith(this.pauseIndex$),
  );
  private index = toSignal(this.index$, {initialValue: 0});

  private indexFirstChar = computed(() => {
    const index = this.index();
    const largestIndexInScope = this.eolPositions
      .findLastIndex(pos => pos < index);
    // Lines are counted at ending newline char.
    // Add 1 because line #0 ends at line index #1
    const indexLastLine = coerceAtLeast(largestIndexInScope) + 1;
    const indexFirstLine = coerceAtLeast(indexLastLine - this.bufferLines + 1);
    return this.eolPositions[indexFirstLine - 1] ?? 0;
  });

  private contents$ = combineLatest([
    toObservable(this.index),
    toObservable(this.indexFirstChar),
  ]).pipe(
    sampleTime(30),
    map(([index, indexFirstChar]) =>
      this.getTrimmedContents(this.allSections, index, indexFirstChar)),
  );

  private getTrimmedContents(
    sections: LightableContent[],
    index: number,
    indexFirstChar: number,
  ): LightableContent[] {
    const content: LightableContent[] = [];
    for (const section of sections) {
      if (section.index >= index) break;
      if (section.index < indexFirstChar) continue;

      const sectionFinalIndex = section.index + section.content.length;
      if (sectionFinalIndex < index) {
        content.push(section);
        continue;
      }

      const diff = index - section.index;
      const trimmedContent: LightableContent = {
        ...section,
        content: section.content.slice(0, diff),
        type: 'normal',
      };
      content.push(trimmedContent);
    }

    const lastContent = content.at(-1);
    if (!lastContent) return [];

    const cursorChar = lastContent.content.at(-1);
    if (!cursorChar) return [];

    const finalIndex = lastContent.index + lastContent.content.length;
    lastContent.content = lastContent.content.slice(0, -1);

    const cursor: LightableContent = {
      content: cursorChar,
      type: 'cursor',
      id: -1,
      index: finalIndex,
    };
    content.push(cursor);
    return content;
  }

  protected contents = toSignal(this.contents$);
  protected isPrinting = toSignal(
    this.index$.pipe(
      debounceTime(500),
      map(() => false),
      startWith(true),
    ));

  constructor() {
    const destroyPauseTimer$ = new Subject<void>();
    inject(DestroyRef).onDestroy(() => {
      destroyPauseTimer$.next();
      destroyPauseTimer$.complete();
    });

    effect(() => {
      if (this.step() === 0) {
        destroyPauseTimer$.next();
        return;
      }

      const min = this.tempoGenerator.currentIndex;
      const max = this.maxIndex;

      const trimMax = .5 * max;
      const timeList: number[] = makeNumberList(trimMax)
        .map(n => {
          const t = n / trimMax;
          const curve = Math.cos(-.2 + 1.2 * Math.PI * t);
          const dtRate = Math.abs(curve) * 10;
          return dtRate;
        });

      const trigger$ = new BehaviorSubject<number>(min);
      trigger$.pipe(
        takeWhile(n => n < max),
        concatMap(n => {
          const time = timeList[n % trimMax] ?? 0;
          return timer(time).pipe(map(() => (time > 0) ? n : (n + 1)));
        }),
        tap(n => {
          const newIndex = ++n;
          trigger$.next(newIndex);
          this.pauseIndex$.next(n);
        }),
        takeUntil(destroyPauseTimer$),
      ).subscribe();
    });

    const book = this.book;
    this.allMatches = [
      {m: book.matchAll(/\b(\w+ing)\b/gd), title: '+ ing'},
      {m: book.matchAll(/\b(\w+ed)\b/gd), title: '+ ed'},
      {m: book.matchAll(/\b(\w+-\w+)\b/gd), title: 'Hyphenated'},
    ].flatMap(it => it.m.toArray().map(m =>
      ({m, title: it.title, word: m[0], index: m.index})))
      .sort((a, b) => a.m.index - b.m.index);

    this.allGroups = Object.groupBy(this.allMatches,
      ({title}) => title) as typeof this.allGroups;
    this.allSections = this.allContentSections(book, this.allMatches);
  }

  /** Lists all spans to be displayed for the current cursorIndex */
  private allContentSections(book: string, matches: MatchedWord[])
    : LightableContent[] {

    let id = 0;
    const content: LightableContent[] = [];

    let previousIndex = 0;
    for (const wordMatch of matches) {
      if (!('indices' in wordMatch.m) || !wordMatch.m.indices) continue;
      const indices = wordMatch.m.indices[0];
      if (!indices) continue;

      const [a, b] = indices;

      if (a > previousIndex) {
        const leadingContent: LightableContent = {
          content: book.slice(previousIndex, a),
          type: 'normal',
          id: id++,
          index: previousIndex,
        };
        content.push(leadingContent);
        previousIndex = b;
      }

      const wordContent: LightableContent = {
        content: book.slice(a, b),
        type: 'match',
        id: id++,
        index: a,
      };
      content.push(wordContent);
    }

    if (book.length > previousIndex) {
      const endingContent: LightableContent = {
        content: book.slice(previousIndex),
        type: 'normal',
        id: id++,
        index: previousIndex,
      };
      content.push(endingContent);
    }

    return content;
  }

}
