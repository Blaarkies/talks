import {
  Component,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mode-interactive',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './mode-interactive.component.html',
  styleUrl: './mode-interactive.component.scss',
})
export class ModeInteractiveComponent {
}
