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
import { splitStringToRunLengthEncoding } from '../../common/encode';
import { RunLengthDefinitionComponent } from '../run-length-definition/run-length-definition.component';
import { RunLengthPreviewComponent } from '../run-length-preview/run-length-preview.component';

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
})
export class CustomRunLengthInputComponent {

  protected chars = [
    [sep, 'LF'],
    [' ', 'SPACE'],
  ].concat(Object.values(chars).map(c => [c, c]));
  protected editMode = signal(false);
  protected encoderMode = signal(false);
  protected userInputValue = model<string>(
    `▒▓▒▒${sep}▒▒▓▓`);

  protected encodings = computed(() => {
    let imageString = this.userInputValue();
    if (!imageString) {
      return;
    }
    let runLines = splitStringToRunLengthEncoding(
      imageString.split(sep).join(''));

    return runLines.map(l => [l.length, l[0]]);
  });
  protected imageWidth = computed(() => {
    let lengths = this.userInputValue().split(sep)
      .map(l => l.length);
    return Math.max(...lengths);
  });

  private inputTextArea = viewChild('inputTextArea',
    {read: ElementRef<HTMLTextAreaElement>});

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

  protected toggleEncoderMode() {
    this.encoderMode.update(v => !v);
  }
}
