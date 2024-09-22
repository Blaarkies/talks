import {
  Component,
  HostListener,
  inject,
} from '@angular/core';
import {
  Router,
  RouterOutlet,
} from '@angular/router';
import { ButtonComponent } from '../../common/component/button/button.component';
import { ClickerService } from './service/clicker.service';
import {
  FontSizeService,
  SlideMode,
} from './service/font-size.service';

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
})
export class ModePresentationComponent {

  private router = inject(Router);
  private clickerService = inject(ClickerService);

  private keydownActionMap = new Map<string, (event?: KeyboardEvent) => void>([
    ['ArrowRight', e => e.ctrlKey
                        ? this.clickerService.forward()
                        : this.clickerService.right()],
    ['ArrowLeft', e => e.ctrlKey
                       ? this.clickerService.backward()
                       : this.clickerService.left()],
  ]);

  constructor() {
    inject(FontSizeService).setSlideMode(SlideMode.presentation);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    this.keydownActionMap.get(event.key)?.(event);


  }

  forward() {
    this.clickerService.forward();
  }

  backward() {
    this.clickerService.backward();
  }

  quit() {
    this.router.navigate(['../']);
  }

}
