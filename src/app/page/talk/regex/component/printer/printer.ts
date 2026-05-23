import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { matchSplitGroup } from '@talk/regex/common/match-split';

type SectionType = ReturnType<typeof matchSplitGroup>[0]

@Component({
  selector: 'app-printer',
  imports: [
    NgClass,
  ],
  templateUrl: './printer.html',
  styleUrl: './printer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Printer {

  sections = input.required<SectionType[]>();

}
