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
import { mockTextIntFloat } from '@talk/regex/slide/teaser/data';

@Component({
  selector: 'app-basic-matching',
  imports: [
    ButtonComponent,
    PaneComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './basic-matching.html',
  styleUrl: './basic-matching.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicMatching {

  private mockText = mockTextIntFloat.slice(0, 495);

  protected globalFlagControl = new FormControl(false);
  private globalFlag = toSignal(this.globalFlagControl.valueChanges);

  protected index = signal(-1);
  protected selectedRegex = computed(() => {
    const patterns = [
      `Smith`,
      `\\d+`,
      `\\d*\\.\\d+`,
    ];
    return patterns[this.index()];
  });

  protected tabs = [
    {label: 'CRTL+F Find'},
    {label: 'Find Integer'},
    {label: 'Find Decimal Number'},
  ];

  protected setActiveTab(index: number) {
    this.index.set(index);
  }

  protected displayText = computed(() => {
    const globalFlag = this.globalFlag();
    const flags = globalFlag ? 'g' : '';

    const regex = new RegExp(this.selectedRegex(), flags);

    let textSupply = this.mockText;
    const sections = [];
    const matches = textSupply.match(regex);

    let id = this.index() * 100;
    for (const match of matches.filter(Boolean)) {
      const index = textSupply.indexOf(match);
      const before = textSupply.slice(0, index);

      sections.push(
        {id: ++id, content: before},
        {id: ++id, type: 'match', content: match});

      textSupply = textSupply.slice(index + match.length);
    }

    sections.push({id: ++id, content: textSupply});

    return sections;
  });

}
