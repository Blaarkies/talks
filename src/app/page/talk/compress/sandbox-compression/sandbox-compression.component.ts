import { Component } from '@angular/core';
import { EntropyPreviewComponent } from '../component/entropy-preview/entropy-preview.component';

@Component({
  selector: 'app-sandbox-compression',
  standalone: true,
  imports: [
    EntropyPreviewComponent,
  ],
  templateUrl: './sandbox-compression.component.html',
  styleUrl: './sandbox-compression.component.scss'
})
export class SandboxCompressionComponent {

}
