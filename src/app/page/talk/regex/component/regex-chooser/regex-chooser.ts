import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '@app/common/component/button/button.component';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import {
  Clicker,
  SlideName,
} from '@app/page/mode-presentation/service/clicker';
import { matchSplitGroup } from '@talk/regex/common/match-split';
import { Checkbox } from '@talk/regex/component/checkbox/checkbox';
import { Printer } from '@talk/regex/component/printer/printer';
import {
  combineLatest,
  scan,
  switchMap,
} from 'rxjs';

export type RegexEntry = {
  regex: string
  label: string
  /** Nested groups such as backreference breaks the matchSplitGroup skip
   * counter. Manually define the range of groups to slice */
  skip?: number[]
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

  private clickerService = inject(Clicker);
  private injector = inject(Injector);

  content = input.required<string>();
  regexList = input.required<RegexEntry[]>();
  slideName = input.required<SlideName>();

  skipGroupCount = input(0);

  private step$ = combineLatest([
    toObservable(this.regexList),
    toObservable(this.slideName),
  ]).pipe(
    switchMap(([list, name]) => toObservable(
      // +1 step, permits empty step at start
      this.clickerService.registerSlide(name, list.length),
      {injector: this.injector})));

  private step = toSignal(this.step$, {initialValue: -1});

  protected lastTabIndexToShow = toSignal(
    toObservable(this.step)
      .pipe(scan((max, c) => Math.max(max, c + 3), 3)));
  protected activeItem = computed(() =>
    this.regexList()[this.step() - 1]);

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

    return matchSplitGroup(content, regex, seed, item?.skip ?? skip);
  });

  constructor() {
    effect(() => {
      this.step();
      this.globalFlagControl.setValue(false);
    });
  }

  protected setActiveTab(item: RegexEntry) {
    // +1 step, permits empty step at start
    const index = this.regexList().indexOf(item) + 1;
    const difference = index - this.step();

    this.clickerService.autoStep(difference);
  }
}
