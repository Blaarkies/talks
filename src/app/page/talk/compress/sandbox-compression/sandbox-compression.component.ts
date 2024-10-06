import { Component } from '@angular/core';
import { CustomRunLengthInputComponent } from '../component/custom-run-length-input/custom-run-length-input.component';
import { EntropyPreviewComponent } from '../component/entropy-preview/entropy-preview.component';

@Component({
  selector: 'app-sandbox-compression',
  standalone: true,
  imports: [
    EntropyPreviewComponent,
    CustomRunLengthInputComponent,
  ],
  templateUrl: './sandbox-compression.component.html',
  styleUrl: './sandbox-compression.component.scss',
})
export class SandboxCompressionComponent {

}
