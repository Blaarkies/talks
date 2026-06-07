import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { PresenterNotesService } from '@app/page/presenter-notes';

@Component({
  selector: 'app-cheat-sheet',
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './cheat-sheet.html',
  styleUrl: './cheat-sheet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideCheatSheet {

  protected cheats = content.trim().split('\n')
    .map(line => line.match(/([^\0]*)\0+(.*)/)?.slice(1, 3));

  constructor() {
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(8, 0));
  }

}

const content = `
.\0Anything (not linefeed)
\\d\0Digit
\\D\0Non-digit
\\w\0Word character
\\W\0Non-word character
\\s\0White space
\\S\0Non-white space
\\b\0Word-boundary
\\.\0Escaped dot (literal)
\\+ \\? \\( \\! \0Match literal character
[aeiou]\0 Custom character class
[0-9]\0 Character range
[^a]\0 Any character except "a"
a?\0 Once or none
a+\0 Multiple
a*\0 Multiple or none
a{2}\0 Twice
a{1,3}\0 1-3 times
a{,5}\0 Up to 5 times
a{4,}\0 At least 4 times
a+?\0 Lazy quantifier
(a|b)\0 Capturing group, either "a" or "b"
(?:day)\0 Non-capturing group, ignores "day"
More...\0https://techearl.com/regex-cheat-sheet
`;
