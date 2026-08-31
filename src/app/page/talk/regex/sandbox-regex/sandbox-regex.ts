import {
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
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
import { ButtonComponent } from '@component/button/button.component';
import { PaneComponent } from '@component/pane/pane.component';
import { TooltipComponent } from '@component/tooltip/tooltip.component';
import {
  IError,
  Result,
  Return,
} from '@app/common/type/result';
import { matchSplitGroup } from '@talk/regex/common/match-split';
import { mockTextA } from '@talk/regex/common/mock-text';
import { SandboxFlags } from '@talk/regex/component/sandbox-flags/sandbox-flags';
import { RegexSandboxError } from '@talk/regex/sandbox-regex/type';
import SlideCheatSheet from '@talk/regex/slide/cheat-sheet/cheat-sheet';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-sandbox-regex',
  imports: [
    PaneComponent,
    NgTemplateOutlet,
    ButtonComponent,
    TooltipComponent,
    ReactiveFormsModule,
    NgClass,
    SandboxFlags,
    SlideCheatSheet,
  ],
  templateUrl: './sandbox-regex.html',
  styleUrl: './sandbox-regex.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SandboxRegex {

  protected flags = [
    {
      value: 'g',
      default: false && true,
      label: 'Global search',
      description: 'Glo',
    },
    {
      value: 'i',
      default: false,
      label: 'Case Insensitive',
      description: 'aZzA',
    },
    {
      value: 's',
      default: false,
      label: 'Dotall',
      description: 'aZzA',
    },
    {
      value: 'm',
      default: false,
      label: 'Multiline',
      description: 'aZzA',
    },
  ];
  protected activeFlags = signal(new Set<typeof this.flags[0]>());

  // protected regexControl = new FormControl(',[\\w\\s]+,');
  protected regexControl = new FormControl('(\\w+)\\s+(\\w+)');
  private regexValue = toSignal(this.regexControl.valueChanges.pipe(
    startWith(this.regexControl.value)));

  private regexResult = computed<Result<RegExp, RegexSandboxError>>(() => {
    const regexInput = this.regexValue();
    const flags = this.activeFlags();

    try {
      const flagString = Array.from(flags).map(f => f.value).join('');
      return Return.ok(new RegExp(regexInput, flagString));
    } catch (e) {
      return Return.error(
        RegexSandboxError.REG_EXP_PARSE_ERR,
        e.toString());
    }
  });

  protected regexError = computed<null | IError<RegexSandboxError>>(() => {
    const regexResult = this.regexResult();
    return regexResult.ok() ? null : regexResult;
  });

  private currentText = signal(mockTextA);
  protected textSections = computed(() => {
    const text = this.currentText();

    const regexResult = this.regexResult();
    if (!regexResult.ok()) {
      return matchSplitGroup(text, new RegExp(''), 1, 0);
    }

    const hasGroups = this.hasCaptureGroups(regexResult.value);
    const skipGroups = Number(hasGroups);
    return matchSplitGroup(text, regexResult.value, 1, skipGroups);
  });
  protected matches = computed(() =>
    this.textSections().filter(s => s.type === 'match'));

  private hasCaptureGroups(value: RegExp): boolean {
    const source = value.source;
    const normalized = source
      .replaceAll('\\\\', '\\')
      .replaceAll('\\\\', '\\');
    const noIgnored = normalized
      .replaceAll('(?:', '')
      .replaceAll('\\(', '');
    const groups = noIgnored.split('').filter(c => c === '(');

    return !!groups.length;
  }

  protected editTextControl = new FormControl(this.currentText());
  protected isEditing = signal(false);

  protected startEdit() {
    this.isEditing.set(true);
  }

  protected saveEdit() {
    this.isEditing.set(false);
    this.currentText.set(this.editTextControl.value);
  }

  protected cancelEdit() {
    this.isEditing.set(false);
    this.editTextControl.setValue(this.currentText());
  }

}
