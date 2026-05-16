import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
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
    PaneComponent,
  ],
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideFlag {

  private clickerService = inject(ClickerService);
  private text = getSizedMockText(60, mockTextA.slice(-154));

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
      sectionsBefore: undefined,
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('big', 'i'), 0, 0),
    },
    {
      label: 'Dotall', flag: 's',
      description: 'Allows the dot(.) operator to match linefeed characters.',
      test: 'the.*follow',
      sectionsBefore: undefined,
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('the.*follow', 's'), 0, 0),
    },
    {
      label: 'Multiline', flag: 'm',
      description: 'Treats the input text as separate lines, each split between linefeed characters. This changes the behaviour of the line start/end ^ $ operators',
      test: 'the$',
      sectionsBefore: undefined,
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('the$', 'm'), 0, 0),
    },
  ];

  protected step = inject(ClickerService).makeSafeStepperSignal(this.tabs.length - 1);

  protected setActiveTab(index: number) {
    const difference = index - this.step();
    this.clickerService.autoStep(difference);
  }

}
