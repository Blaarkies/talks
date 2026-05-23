import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  getSizedMockText,
  mockTextIntFloat,
} from '@talk/regex/common/mock-text';
import {
  RegexChooser,
  RegexEntry,
} from '@talk/regex/component/regex-chooser/regex-chooser';

@Component({
  selector: 'app-basic-matching',
  imports: [
    ReactiveFormsModule,
    RegexChooser,
  ],
  templateUrl: './basic-matching.html',
  styleUrl: './basic-matching.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideBasicMatching {

  protected mockText = getSizedMockText(70, mockTextIntFloat.slice(0, 336));

  protected regexList = [
    [`Smith`, 'Ctrl+F Find'],
    [`\\d+`, 'Find Integer'],
    [`\\d+\\.\\d+`, 'Find Decimal Number'],
  ].map(([regex, label]) => (<RegexEntry>{regex, label}));

}
