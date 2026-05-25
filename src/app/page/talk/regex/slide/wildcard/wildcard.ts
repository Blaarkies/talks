import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { PresenterNotesService } from '@app/page/presenter-notes';
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
  templateUrl: './wildcard.html',
  styleUrl: './wildcard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlideWildcard {

  protected mockText = mockTextHex.split('\n').slice(0, 5)
    .map(l => l.replace(/\d+ +/, ''))
    .join('\n');

  protected regexList = [
    [`\\d*`, 'Digit'],
    [`\\w*`, 'Alphanumeric'],
    [`.*`, 'Wildcard'],
    [`[0-4]+`, 'Custom Number'],
    [`[A-Z]+`, 'Custom Letters'],
    [`\\d{2}`, 'Quantifier'],
    [`\\b\\w{3,5}\\b`, 'Bounds'],
    [`\\s{2}`, 'Space'],
  ].map(([regex, label]) => (<RegexEntry>{regex, label}));

  constructor() {
    const numberedStep = inject(ClickerService).makeSafeStepperSignal(
      this.regexList.length);
    const presenterNotesService = inject(PresenterNotesService);
    effect(() => presenterNotesService.setSlide(5, numberedStep()));
  }


}
