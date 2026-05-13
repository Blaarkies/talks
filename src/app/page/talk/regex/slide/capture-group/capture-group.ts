import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  RegexChooser,
  RegexEntry,
} from '@talk/regex/component/regex-chooser/regex-chooser';

@Component({
  selector: 'app-capture-group',
  imports: [
    ReactiveFormsModule,
    RegexChooser,
  ],
  templateUrl: './capture-group.html',
  styleUrl: './capture-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideCaptureGroup {

  protected mockText = `
  249K views • 3 years ago
  2M views • 11 months ago
  31K views • 1 month ago
  931 views • 6 days ago
  `.trim();

  protected regexList = [
    [`(\\d+ \\w+) ago`, 'Age'],
    [`(\\d+) (year|month|day)s? ago`, 'Separate'],
    [`(\\d+)(K|M|G)? views • (?:\\d+)`, 'Non-Capture'],
  ].map(([regex, label]) => (<RegexEntry>{regex, label}));

}
