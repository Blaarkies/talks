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
import { matchSplit } from '@talk/regex/common/match-split';
import { mockTextIntFloat } from '@talk/regex/common/mock-text';
import { Checkbox } from '@talk/regex/component/checkbox/checkbox';

@Component({
  selector: 'app-basic-matching',
  imports: [
    ButtonComponent,
    PaneComponent,
    ReactiveFormsModule,
    Checkbox,
  ],
  templateUrl: './basic-matching.html',
  styleUrl: './basic-matching.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicMatching {

  private mockText = mockTextIntFloat.slice(0, 336);
  private patterns = [
    `Smith`,
    `\\d+`,
    `\\d+\\.\\d+`,
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
    {label: 'Ctrl+F Find'},
    {label: 'Find Integer'},
    {label: 'Find Decimal Number'},
  ];

  protected displayText = computed(() => {
    const regex = new RegExp(this.selectedRegex(), this.regexFlags());
    return matchSplit(this.mockText, regex, this.index() * 100);
  });

  protected setActiveTab(index: number) {
    this.index.set(index);
  }

}
