import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { mockTextHex } from '@talk/regex/common/mock-text';
import {
  RegexChooser,
  RegexEntry,
} from '@talk/regex/component/regex-chooser/regex-chooser';

@Component({
  selector: 'app-wildcard',
  imports: [
    ReactiveFormsModule,
    RegexChooser,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideWildcard {

  protected mockText = mockTextHex.split('\n').slice(0, 5)
    .map(l => l.replace(/\d+ +/, '').replace(/(\w\w ){4}/, ''))
    .join('\n');

  protected regexList = [
    [`\\d*`, 'Digit'],
    [`\\w*`, 'Alphanumeric'],
    [`.*`, 'Wildcard'],
    [`[0-4]`, 'Custom Digits'],
    [`[A-Z]`, 'Custom Letters'],
    [`[^aouieAOUIE]`, 'Custom Exclusions'],
    [`\\d{2}`, 'Quantifier'],
    [`\\b\\w{3,5}\\b`, 'Bounds'],
    [`\\s`, 'White Space'],
    [`\\S`, 'Non-White Space'],
    [`\\D`, 'Non-Digit'],
    [`\\W`, 'Non-Word'],
    [`([^\\w\\s]).*\\1`, 'Backreference', [0, 1]],
  ].map(([regex, label, skip]) => (<RegexEntry>{regex, label, skip}));

}
