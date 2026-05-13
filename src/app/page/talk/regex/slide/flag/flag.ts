import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { matchSplitGroup } from '@talk/regex/common/match-split';
import {
  getSizedMockText,
  mockTextA,
} from '@talk/regex/common/mock-text';
import { PixelationBook } from '@talk/regex/component/pixelation-book/pixelation-book/pixelation-book';
import { Printer } from '@talk/regex/component/printer/printer';

@Component({
  selector: 'app-flag',
  imports: [
    PixelationBook,
    NgTemplateOutlet,
    Printer,
  ],
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideFlag {

  private text = getSizedMockText(60, mockTextA.slice(-154));

  protected index = signal(0);

  protected tabs = [
    {
      label: 'Global Search', flag: 'g',
      description: 'Instead of stopping at the first match, Global Search will continue testing for more matches until the end of text. This will return a list of all matches.',
      test: 'the',
      sectionsBefore: matchSplitGroup(this.text,
        new RegExp('the'), 0, 0),
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('the', 'g'), 0, 0),
    },
    {
      label: 'Case-insensitive', flag: 'i',
      description: 'Matches both uppercase and lowercase occurrences.',
      test: 'big',
      sectionsBefore: '',
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('big', 'i'), 0, 0),
    },
    {
      label: 'Dotall', flag: 's',
      description: 'Allows the dot(.) operator to match linefeed characters.',
      test: 'the.*follow',
      sectionsBefore: '',
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('the.*follow', 's'), 0, 0),
    },
    {
      label: 'Multiline', flag: 'm',
      description: 'Treats the input text as separate lines, each split between linefeed characters. This changes the behaviour of the line start/end ^ $ operators',
      test: 'the$',
      sectionsBefore: '',
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('the$', 'm'), 0, 0),
    },
  ];

}
