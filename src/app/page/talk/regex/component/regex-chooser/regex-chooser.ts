import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
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
import { ClickerService } from '@app/page/mode-presentation/service/clicker.service';
import { matchSplitGroup } from '@talk/regex/common/match-split';
import { Checkbox } from '@talk/regex/component/checkbox/checkbox';
import { Printer } from '@talk/regex/component/printer/printer';
import { switchMap } from 'rxjs';

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

  private clickerService = inject(ClickerService);

  content = input.required<string>();
  regexList = input.required<RegexEntry[]>();
  skipGroupCount = input(0);

  private step = toSignal(
    toObservable(this.regexList).pipe(
      switchMap(({length}) => this.clickerService
          .makeSafeStepperObservable(length - 1, -1))),
  );

  protected activeItem = computed(() =>
    this.regexList()[this.step()]);

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
    const index = this.regexList().indexOf(item);
    const difference = index - this.step();

    this.clickerService.autoStep(difference);
  }
}
