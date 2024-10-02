import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import {
  Component,
  DestroyRef,
  effect,
  HostListener,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import {
  Router,
  RouterOutlet,
} from '@angular/router';
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
  ],
  providers: [ClickerService],
  templateUrl: './mode-presentation.component.html',
  styleUrl: './mode-presentation.component.scss',
})
export class ModePresentationComponent {

  protected headerHeight = signal<number | null>(null);

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
    inject(FontSizeService).setSlideMode(SlideMode.presentation);

    inject(BreakpointObserver)
      .observe('(width < 1500px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({matches}) => console.log(matches ? '❌Why are you MOBILE?' : '✅good desktop'))
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

  right() {
    this.clickerService.right();
  }

  left() {
    this.clickerService.left();
  }

  quit() {
    this.router.navigate(['../']);
  }

  setHeaderHeight(component: HasRimHeader) {
    toObservable(component.rimHeaderHeight, {injector: this.injector})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(height => this.headerHeight.set(height));
  }
}
