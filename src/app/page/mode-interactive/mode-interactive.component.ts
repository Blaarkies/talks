import {
  Component,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RimComponent } from '../../common/component/rim/rim.component';

@Component({
  selector: 'app-mode-interactive',
  standalone: true,
  imports: [
    RouterOutlet,
    RimComponent,
  ],
  templateUrl: './mode-interactive.component.html',
  styleUrl: './mode-interactive.component.scss',
})
export class ModeInteractiveComponent {
}
