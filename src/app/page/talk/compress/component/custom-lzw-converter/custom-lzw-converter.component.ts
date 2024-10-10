import { Component } from '@angular/core';
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
  styleUrl: './custom-lzw-converter.component.scss'
})
export class CustomLzwConverterComponent {


  protected encodeStringToLzwFn = (text: string) => {
    let lzwSteps = encodeToLzw(text);

    return lzwSteps
      .map(s => s.code)
      .filter(c => c)
      .map(c => String.fromCharCode(c))
      .join('');
  };

  protected decodeLzwToStringFn = (text: string) => {
    return decodeLZW(text);
  };

}
