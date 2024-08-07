import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../common/component/button/button.component';
import { ClickerService } from './service/clicker.service';

@Component({
  selector: 'app-mode-presentation',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonComponent,
  ],
  providers: [ClickerService],
  templateUrl: './mode-presentation.component.html',
  styleUrl: './mode-presentation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModePresentationComponent {

  private clickerService = inject(ClickerService);

  private keydownActionMap = new Map<string, () => void>([
    ['ArrowRight', () => this.clickerService.right()],
    ['ArrowLeft', () => this.clickerService.left()],
  ]);

  forward() {
    this.clickerService.forward();
  }

  backward() {
    this.clickerService.backward();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    this.keydownActionMap.get(event.key)?.();
  }


}
