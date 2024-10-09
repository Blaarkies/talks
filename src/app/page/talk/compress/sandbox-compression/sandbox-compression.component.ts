import { Component } from '@angular/core';
import { CustomBinaryConverterComponent } from '../component/custom-binary-converter/custom-binary-converter.component';
import { CustomInputEncoderDecoderComponent } from '../component/custom-input-encoder-decoder/custom-input-encoder-decoder.component';
import { CustomRunLengthInputComponent } from '../component/custom-run-length-input/custom-run-length-input.component';
import { EntropyPreviewComponent } from '../component/entropy-preview/entropy-preview.component';

@Component({
  selector: 'app-sandbox-compression',
  standalone: true,
  imports: [
    EntropyPreviewComponent,
    CustomRunLengthInputComponent,
    CustomInputEncoderDecoderComponent,
    CustomBinaryConverterComponent,
  ],
  templateUrl: './sandbox-compression.component.html',
  styleUrl: './sandbox-compression.component.scss',
})
export class SandboxCompressionComponent {

}
