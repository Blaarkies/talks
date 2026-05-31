import {
  CdkMenu,
  CdkMenuBar,
  CdkMenuItem,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '@app/common/component/button/button.component';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { TooltipComponent } from '@app/common/component/tooltip/tooltip.component';
import {
  IError,
  Result,
  Return,
} from '@app/common/type/result';
import { TaskbarMenu } from '@app/page/main-menu/component/taskbar-menu/taskbar-menu';
import { matchSplitGroup } from '@talk/regex/common/match-split';
import { mockTextA } from '@talk/regex/common/mock-text';
import { Checkbox } from '@talk/regex/component/checkbox/checkbox';
import { RegexSandboxError } from '@talk/regex/sandbox-regex/type';
import {
  map,
  merge,
  scan,
  startWith,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-sandbox-regex',
  imports: [
    PaneComponent,
    NgTemplateOutlet,
    ButtonComponent,
    TooltipComponent,
    Checkbox,
    ReactiveFormsModule,
    NgClass,
    TaskbarMenu,
    CdkMenu,
    CdkMenuBar,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  templateUrl: './sandbox-regex.html',
  styleUrl: './sandbox-regex.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SandboxRegex {

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
    if (regexResult.ok()) {
      return null;
    }

    return regexResult;
  });

  protected textSections = computed(() => {
    const text = mockTextA;

    const regexResult = this.regexResult();
    if (!regexResult.ok()) {
      return matchSplitGroup(text, new RegExp(''), 1, 0);
    }

    const hasGroups = this.hasCaptureGroups(regexResult.value);
    const skipGroups = Number(hasGroups);
    return matchSplitGroup(text, regexResult.value, 1, skipGroups);
  });

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

  protected info = 'Test out your own regex patterns here';

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
    // {value: 'u', default: false, label: 'Unicode', description: 'aZzA',},
    // {value: 'v', default: false, label: 'Unicode Sets', description: 'aZzA',},
    // {value: 'd', default: false, label: 'Has Indices', description: 'aZzA',},
  ].map(data => ({
    ...data,
    control: new FormControl(data.default),
  }));

  private flagChanges$$ = this.flags.map(flag =>
    flag.control.valueChanges.pipe(
      startWith(flag.control.value),
      map(active => ({flag, active}))));
  private activeFlags$ = merge(...this.flagChanges$$).pipe(
    scan((set, c) => {
      const newSet = new Set(set);
      if (c.active) {
        newSet.add(c.flag);
      } else {
        newSet.delete(c.flag);
      }
      return newSet;
    }, new Set<typeof this.flags[0]>()));
  private activeFlags = toSignal(this.activeFlags$);

  log = console.log;
  // a = effect(() => {
  //   const s = this.textSections();
  //   console.log(s);
  // });

  private dr = inject(DestroyRef);

  protected delayClose(ref: CdkMenuTrigger) {
    timer(500).pipe(takeUntilDestroyed(this.dr))
      .subscribe(() => ref.close());
  }

}
