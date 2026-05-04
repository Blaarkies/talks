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
import { mockTextHex } from '@talk/regex/common/mock-text';
import { Checkbox } from '@talk/regex/component/checkbox/checkbox';

@Component({
  selector: 'app-wildcard',
  imports: [
    ButtonComponent,
    Checkbox,
    PaneComponent,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './wildcard.html',
  styleUrl: './wildcard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wildcard {

  private mockText =
    mockTextHex.split('\n').slice(0,5)
      .map(l => l.replace(/\d+ +/, ''))
      .join('\n');
  private patterns = [
    `.*`,
    `\\d*`,
    `\\w*`,
    `[0-4]*`,
    `[A-Z]*`,
    `\\d{2}`,
    `\\b\\w{3,5}\\b`,
    `\\s{2}`,
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
    {label: 'Wildcard'},
    {label: 'Digit'},
    {label: 'Alphanumeric'},
    {label: 'Custom Number'},
    {label: 'Custom Letters'},
    {label: 'Quantifier'},
    {label: 'Bounds'},
    {label: 'Space'},
  ];

  protected displayText = computed(() => {
    const regex = new RegExp(this.selectedRegex(), this.regexFlags());
    return matchSplitGroup(this.mockText, regex, this.index() * 100, 0);
  });

  protected setActiveTab(index: number) {
    this.index.set(index);
  }

}
