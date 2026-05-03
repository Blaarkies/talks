import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  coerceAtLeast,
  isBetween,
  windowed,
} from '@app/common';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { getSizedMockText } from '@talk/regex/common/mock-text';
import { TempoGenerator } from '@talk/regex/slide/teaser/tempo-generator';
import {
  LightableContent,
  MatchedCategory,
  MatchedWord,
} from '@talk/regex/slide/teaser/type';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-slide-teaser',
  imports: [
    PaneComponent,
  ],
  templateUrl: './teaser.html',
  styleUrl: './teaser.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideTeaser {

  private book = getSizedMockText(80).replaceAll('\n\n', '\n');
  private bufferLines = 3; // total lines on screen at a time
  private maxIndex = this.book.length;
  private eolPositions
    = Array.from(this.book.matchAll(/\n/g)).map(m => m.index);

  private allMatches = [
    {m: this.book.matchAll(/\b(\w+ing)\b/g), title: '+ ing'},
    {m: this.book.matchAll(/\b(\w+ed)\b/g), title: '+ ed'},
    {m: this.book.matchAll(/\b(\w+-\w+)\b/g), title: 'Hyphenated'},
  ].flatMap(it => Array.from(it.m).map(m => ({m, title: it.title})))
    .sort((a, b) => a.m.index - b.m.index);

  private inScopeMatches = computed(() => {
    const index = this.index();
    const indexFirstChar = this.indexFirstChar();

    return this.allMatches
      .filter(({m}) => isBetween(m.index, indexFirstChar, index - m[1].length))
      .map(({m, title}) => (<MatchedWord>{i: m.index, regex: m, title}));
  });

  private ledgerMatches = computed(() => {
    const index = this.index();

    return this.allMatches
      .filter(({m}) => m.index + m[1].length < index)
      .map(({m, title}) => ({m: m[1], title}));
  });

  private allGroups = Object.groupBy(this.allMatches, ({title}) => title);

  protected categories = computed(() => {
    const ledgerMatches = this.ledgerMatches();
    const ledgersMatchMap = Object.groupBy(ledgerMatches, ({m}) => m);
    const ledgersGroupMap = Object.groupBy(ledgerMatches, ({title}) => title);

    return Object.entries(this.allGroups).map(([k, v]) =>
      (<MatchedCategory>{
        title: k,
        matches: v.map(m => {
          const label = m.m[1];
          return {label, hide: !ledgersMatchMap[label]};
        }),
        hide: !ledgersGroupMap[k],
      }));
  });

  protected hideLedger = computed(() => {
    const categories = this.categories();
    return !categories.some(c => !c.hide);
  });

  protected index = toSignal(
    new TempoGenerator({
      maxIndex: this.maxIndex,
      start: 1,
      destroyRef: inject((DestroyRef)),
    })
      .index$.pipe(startWith(0)),
  );

  protected items = computed(() => {
    const index = this.index();
    const indexFirstChar = this.indexFirstChar();
    const inScopeMatches = this.inScopeMatches();
    return this.contentSections(index, indexFirstChar, inScopeMatches);
  });

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

  // TODO: better to preprocess all sections, then walk through them to reduce
  // DOM updates
  /** Lists all spans to be displayed for the current cursorIndex */
  private contentSections(cursorIndex: number,
                          indexFirstChar: number,
                          inScopeMatches: MatchedWord[]): LightableContent[] {
    const importantIndices: { i: number, regex?: RegExpExecArray }[] = [
      {i: indexFirstChar},
      ...inScopeMatches,
      {i: cursorIndex},
    ];

    // Compare each milestone along the serial text to the next milestone.
    // Use this to fill a list with highlighted text and normal text
    const contents = windowed(importantIndices)
      .flatMap<LightableContent>(([a, b]) => {
        if (!a.regex) {
          return [
            {
              content: this.book.slice(a.i, b.i),
              type: 'normal',
              id: a.i,
            },
          ];
        }

        const length = a.regex[1].length;
        const indexLightWordEnd = a.i + length;
        const textLight = this.book.slice(a.i, indexLightWordEnd);
        const textNormal = this.book.slice(indexLightWordEnd, b.i);
        return [
          {
            content: textLight,
            type: 'match',
            id: a.i,
          },
          {
            content: textNormal,
            type: 'normal',
            id: indexLightWordEnd,
          },
        ];
      });

    const firstContent = contents[0];
    firstContent.content = firstContent.content.trimStart();

    const lastContent = contents.at(-1);
    const cursorChar = lastContent.content.at(-1);
    lastContent.content = lastContent.content.slice(0, -1);

    const cursor: LightableContent = {
      content: cursorChar,
      type: 'cursor',
      id: -1,
    };

    return [
      ...contents,
      cursor,
    ];
  }

}
