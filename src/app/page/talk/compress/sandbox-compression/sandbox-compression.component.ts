import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../common/component/button/button.component';
import { TooltipComponent } from '../../../../common/component/tooltip/tooltip.component';
import { CustomBinaryConverterComponent } from '../component/custom-binary-converter/custom-binary-converter.component';
import { CustomHuffmanConverterComponent } from '../component/custom-huffman-converter/custom-huffman-converter.component';
import { CustomInputEncoderDecoderComponent } from '../component/custom-input-encoder-decoder/custom-input-encoder-decoder.component';
import { CustomLzwConverterComponent } from '../component/custom-lzw-converter/custom-lzw-converter.component';
import { CustomRunLengthInputComponent } from '../component/custom-run-length-input/custom-run-length-input.component';
import { EntropyPreviewComponent } from '../component/entropy-preview/entropy-preview.component';
import { CoinFlipWorldComponent } from '../slide/slide-calculating-entropy/coin-flip-world/coin-flip-world.component';

@Component({
  selector: 'app-sandbox-compression',
  standalone: true,
  imports: [
    EntropyPreviewComponent,
    CustomRunLengthInputComponent,
    CustomInputEncoderDecoderComponent,
    CustomBinaryConverterComponent,
    CustomHuffmanConverterComponent,
    CustomLzwConverterComponent,
    CoinFlipWorldComponent,
    TooltipComponent,
    ButtonComponent,
  ],
  templateUrl: './sandbox-compression.component.html',
  styleUrl: './sandbox-compression.component.scss',
})
export class SandboxCompressionComponent {

  protected info = `Edit contents to view converted results.
The arrow buttons swap the encoding direction, letting you decode instead.`;

}
