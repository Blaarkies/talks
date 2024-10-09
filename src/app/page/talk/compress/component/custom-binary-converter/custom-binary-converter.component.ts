import { Component } from '@angular/core';
import { chunked } from '../../../../../common';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { CustomInputEncoderDecoderComponent } from '../custom-input-encoder-decoder/custom-input-encoder-decoder.component';

@Component({
  selector: 'app-custom-binary-converter',
  standalone: true,
  imports: [
    CustomInputEncoderDecoderComponent,
    PaneComponent,
  ],
  templateUrl: './custom-binary-converter.component.html',
  styleUrl: './custom-binary-converter.component.scss'
})
export class CustomBinaryConverterComponent {

  protected encodeStringToBinaryFn = (text: string) => {
    return text.split('')
      .map(c => c.charCodeAt(0)
        .toString(2)
        .padStart(8, '0'))
      .join('');
  };

  protected decodeBinaryToStringFn = (binaryText: string) => {
    return chunked(binaryText.split(''), 8)
      .map(bitsArray => {
        let byte = bitsArray.join('');
        let code = parseInt(byte, 2);
        return String.fromCharCode(code);
      })
      .join('');
  };

}
