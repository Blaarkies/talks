import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mode-presentation',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './mode-presentation.component.html',
  styleUrl: './mode-presentation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModePresentationComponent {

}
