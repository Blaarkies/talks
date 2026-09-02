import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
import { matchSplitGroup } from '@talk/regex/common/match-split';
import {
  getSizedMockText,
  mockTextA,
} from '@talk/regex/common/mock-text';
import { Printer } from '@talk/regex/component/printer/printer';

@Component({
  selector: 'app-flag',
  imports: [
    Printer,
    PaneComponent,
  ],
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideFlag {

  private clickerService = inject(ClickerService);
  private text = getSizedMockText(41, mockTextA.slice(-154));

  protected tabs = [
    {
      label: 'Global Search', flag: 'g',
      description: 'Instead of stopping at the first match, Global Search will continue testing for more matches until the end of text. This will return a list of all matches.',
      test: 'th',
      sectionsBefore: matchSplitGroup(this.text,
        new RegExp('th'), 0, 0),
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('th', 'g'), 0, 0),
    },
    {
      label: 'Case-insensitive', flag: 'i',
      description: 'Matches both uppercase and lowercase occurrences.',
      test: 'brother',
      sectionsBefore: undefined,
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('brother', 'i'), 0, 0),
    },
    {
      label: 'Dotall', flag: 's',
      description: 'Allows the dot(.) operator to match linefeed characters.',
      test: 'WATCHING.*YOU',
      sectionsBefore: undefined,
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('WATCHING.*YOU', 's'), 0, 0),
    },
    {
      label: 'Multiline', flag: 'm',
      description: 'Treats the input text as separate lines, each split between linefeed characters. This changes the behaviour of the line start/end ^ $ operators',
      test: 'about$',
      sectionsBefore: undefined,
      sectionsAfter: matchSplitGroup(this.text,
        new RegExp('about$', 'm'), 0, 0),
    },
  ];

  protected step = inject(ClickerService).makeSafeStepperSignal(this.tabs.length - 1);

  protected setActiveTab(index: number) {
    const difference = index - this.step();
    this.clickerService.autoStep(difference);
  }

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(6, this.step()));
  }


}
