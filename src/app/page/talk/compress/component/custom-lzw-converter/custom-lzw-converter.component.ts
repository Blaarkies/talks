import { Component } from '@angular/core';
import { sep } from '../../../../../common';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { decodeLZW } from '../../common/decode';
import { encodeToLzw } from '../../common/encode';
import { CustomInputEncoderDecoderComponent } from '../custom-input-encoder-decoder/custom-input-encoder-decoder.component';

@Component({
  selector: 'app-custom-lzw-converter',
  standalone: true,
  imports: [
    CustomInputEncoderDecoderComponent,
    PaneComponent,
  ],
  templateUrl: './custom-lzw-converter.component.html',
  styleUrl: './custom-lzw-converter.component.scss',
})
export class CustomLzwConverterComponent {

  protected encodeStringToLzwFn = (text: string) =>
    encodeToLzw(text)
      .map(s => s.code)
      .filter(c => c)
      .map(c => String.fromCharCode(c))
      .join('');

  protected decodeLzwToStringFn = (text: string) =>
    decodeLZW(text);

  protected info = 'Encoding values past 255 (the max limit of ASCII ' +
    'characters) are displayed using utf8 characters, such as Ć,Ē,ą,ć, etc.' +
    '<br/>This is not corrupted data, but rather a more realistic' +
    ' representation of the underlying mechanic.';

}
