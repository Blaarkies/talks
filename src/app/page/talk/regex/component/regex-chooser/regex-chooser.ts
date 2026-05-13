import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
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
import { Printer } from '@talk/regex/component/printer/printer';

export type RegexEntry = {
  regex: string
  label: string
}

@Component({
  selector: 'app-regex-chooser',
  imports: [
    ButtonComponent,
    Checkbox,
    PaneComponent,
    Printer,
    ReactiveFormsModule,
  ],
  templateUrl: './regex-chooser.html',
  styleUrl: './regex-chooser.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegexChooser {

  content = input.required<string>();
  regexList = input.required<RegexEntry[]>();
  skipGroupCount = input(0);

  protected activeItem = signal<RegexEntry | undefined>(undefined);

  protected globalFlagControl = new FormControl(false);
  private globalFlag = toSignal(this.globalFlagControl.valueChanges);
  private regexFlags = computed(() => {
    let flags = '';
    if (this.globalFlag()) flags += 'g';
    return flags;
  });

  protected displayText = computed(() => {
    const item = this.activeItem();
    const flags = this.regexFlags();
    const regex = new RegExp(item?.regex, flags);
    const content = this.content();
    const index = this.regexList().indexOf(item);
    const seed = index * 100;
    const skip = this.skipGroupCount();
    return matchSplitGroup(content, regex, seed, skip);
  });

  protected setActiveTab(item: RegexEntry) {
    this.activeItem.set(item);
  }
}
