import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  Injector,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { map } from 'rxjs';
import { routeNames } from '../../../bootstrap/app.routes';
import { ButtonComponent } from '../../common/component/button/button.component';
import { HasRimHeader } from './index';
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
    RouterLink,
  ],
  providers: [ClickerService],
  templateUrl: './mode-presentation.component.html',
  styleUrl: './mode-presentation.component.scss',
})
export class ModePresentationComponent {

  protected headerHeight = signal<number | null>(null);
  protected isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(width < 1500px)')
      .pipe(map(({matches}) => matches)));
  protected warningAccepted = signal(false);
  protected routeMainMenu = routeNames.mainMenu;

  private router = inject(Router);
  private clickerService = inject(ClickerService);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  private keydownActionMap = new Map<string, (event?: KeyboardEvent) => void>([
    ['ArrowRight', e => e.ctrlKey
                        ? this.clickerService.forward()
                        : this.clickerService.right()],
    ['ArrowLeft', e => e.ctrlKey
                       ? this.clickerService.backward()
                       : this.clickerService.left()],
  ]);

  constructor() {
    let fontSizeService = inject(FontSizeService);

    fontSizeService.setSlideMode(SlideMode.presentation);
    fontSizeService.updateFontSize();
  }

  @HostListener('window:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent) {
    if (this.isMobile() && !this.warningAccepted()) {
      return event.key === 'backspace'
             ? this.router.navigate(['../', this.routeMainMenu])
             : this.warningAccepted.set(true);
    }

    this.keydownActionMap.get(event.key)?.(event);
  }

  forward() {
    this.clickerService.forward();
  }

  backward() {
    this.clickerService.backward();
  }

  right() {
    this.clickerService.right();
  }

  left() {
    this.clickerService.left();
  }

  quit() {
    this.router.navigate(['../']);
  }

  protected setHeaderHeight(component: HasRimHeader) {
    toObservable(component.rimHeaderHeight, {injector: this.injector})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(height => this.headerHeight.set(height));
  }

}
