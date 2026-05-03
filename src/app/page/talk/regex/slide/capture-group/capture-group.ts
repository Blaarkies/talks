import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '@app/common/component/button/button.component';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { matchSplitGroup } from '@talk/regex/common/match-split';
import { Checkbox } from '@talk/regex/component/checkbox/checkbox';

@Component({
  selector: 'app-capture-group',
  imports: [
    ButtonComponent,
    Checkbox,
    PaneComponent,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './capture-group.html',
  styleUrl: './capture-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureGroup {

  private mockText = `
  249K views • 3 years ago
  2M views • 11 months ago
  31K views • 1 month ago
  931 views • 6 days ago
  `.trim();
  private patterns = [
    `(\\d+ \\w+) ago`,
    `(\\d+) (year|month|day)s? ago`,
    `(\\d+)(K|M|G)? views • (?:\\d+) (?:year|month|day)s? ago`,
  ];

  protected globalFlagControl = new FormControl(false);
  private globalFlag = toSignal(this.globalFlagControl.valueChanges);
  private regexFlags = computed(() => {
    let flags = '';
    if (this.globalFlag()) flags += 'g';
    return flags;
  });

  protected index = signal(-1);
  protected selectedRegex = computed(() => this.patterns[this.index()]);

  protected tabs = [
    {label: 'Age'},
    {label: 'Separate'},
    {label: 'Non-Capture'},
  ];

  protected displayText = computed(() => {
    const regex = new RegExp(this.selectedRegex(), this.regexFlags());
    return matchSplitGroup(this.mockText, regex, this.index() * 100);
  });

  protected setActiveTab(index: number) {
    this.index.set(index);
  }

}
