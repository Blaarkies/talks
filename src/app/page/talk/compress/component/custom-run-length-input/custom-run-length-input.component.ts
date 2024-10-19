import {
  Component,
  computed,
  ElementRef,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  chars,
  sep,
} from '../../../../../common';
import { ButtonComponent } from '../../../../../common/component/button/button.component';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import {
  decodeRunLength,
  getRunLengthEncodings,
  tryWrappedGetRunLengthEncodings,
} from '../../common/decode';
import { splitStringToRunLengthEncoding } from '../../common/encode';
import { RunLengthDefinitionComponent } from '../run-length-definition/run-length-definition.component';
import { RunLengthPreviewComponent } from '../run-length-preview/run-length-preview.component';
import { animateHeight } from './animations';

let defaultImage =
  `
░░░▓░░░░
░░▓▓▓░░░
░▓▓▓▓▓░░
░░░░░░░░`
    .slice(1);

@Component({
  selector: 'app-custom-run-length-input',
  standalone: true,
  imports: [
    RunLengthPreviewComponent,
    ButtonComponent,
    FormsModule,
    RunLengthDefinitionComponent,
    PaneComponent,
  ],
  templateUrl: './custom-run-length-input.component.html',
  styleUrl: './custom-run-length-input.component.scss',
  animations: [animateHeight],
})
export class CustomRunLengthInputComponent {

  protected chars = [
    [sep, 'LF'],
    [' ', ' '],
  ].concat(Object.values(chars).map(c => [c, c]));

  protected editMode = signal(false);
  protected decodeMode = signal(false);
  protected userInputValue = model<string>(defaultImage);

  protected encodings = computed(() => {
    let input = this.userInputValue();
    if (!input) {
      return;
    }

    let filledInput = this.imageFillGaps(input);

    if (this.decodeMode()) {
      return tryWrappedGetRunLengthEncodings(filledInput)
        .encodings;
    }

    let runLines = splitStringToRunLengthEncoding(
      filledInput.split(sep).join(''));

    return runLines.map(l => [l.length, l[0]]);
  });

  protected imageWidth = computed(() => {
    if (this.decodeMode()) {
      return tryWrappedGetRunLengthEncodings(
        this.userInputValue()).width;
    }
    let lengths = this.userInputValue().split(sep)
      .map(l => l.length);
    return Math.max(...lengths);
  });

  protected previewData = computed(() =>
    this.decodeMode()
    ? decodeRunLength(this.userInputValue())
    : this.cleanInputValue());

  private cleanInputValue = computed(() =>
    this.imageFillGaps(this.userInputValue()));

  private inputTextArea = viewChild<ElementRef<HTMLTextAreaElement>>
  ('inputTextArea');

  private imageFillGaps(text: string): string {
    let runs = text.split(sep);
    let width = Math.max(...runs.map(r => r.length));

    return runs.map(r => r.padEnd(width, ' ')).join(sep);
  }

  protected inputChar(char: string) {
    let element = this.inputTextArea().nativeElement;

    let cursor = element.selectionStart;
    let data = element.value;

    element.value = data.slice(0, cursor)
      + char
      + data.slice(cursor);
    element.dispatchEvent(
      new InputEvent('input'));

    let newCursor = cursor + 1;
    element.setSelectionRange(newCursor, newCursor);

    element.focus();
  }

  protected toggleEditMode() {
    this.editMode.update(v => !v);
  }

  protected toggleDecodeMode() {
    if (this.decodeMode()) {
      try {
        getRunLengthEncodings(this.userInputValue());
      } catch (e) {
        return;
      }
    }

    this.userInputValue.update(oldInput =>
      this.decodeMode()
      ? decodeRunLength(oldInput)
      : this.imageWidth()
        + 'W'
        + (this.encodings()?.flat().join('') ?? ''));

    this.decodeMode.update(v => !v);
  }

  protected quickSelectionIsOpen = signal(false);

  protected toggleCharSelector() {
    this.quickSelectionIsOpen.update(v => !v);
  }
}
