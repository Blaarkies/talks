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
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';
import { map } from 'rxjs';
import { routeNames } from '@app/bootstrap/routes';
import { ButtonComponent } from '../../common/component/button/button.component';
import { HasRimHeader } from './index';
import { ClickerService } from './service/clicker.service';
import {
  FontSizeService,
  SlideMode,
} from './service/font-size.service';

@Component({
  selector: 'app-mode-presentation',
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

  private storage = inject(WA_LOCAL_STORAGE);
  private keyWarning = 'tiny-screen-warning-accepted';

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
    const fontSizeService = inject(FontSizeService);

    fontSizeService.setSlideMode(SlideMode.presentation);
    fontSizeService.updateFontSize();

    const storageWarning = Boolean(this.storage.getItem(this.keyWarning));
    this.warningAccepted.set(storageWarning);
  }

  protected setTinyScreenWarning() {
    this.warningAccepted.set(true);
    this.storage.setItem(this.keyWarning, String(true));
  }

  @HostListener('window:keydown', ['$event'])
  protected handleKeydown(event: KeyboardEvent) {
    if (this.isMobile() && !this.warningAccepted()) {
      return event.key === 'backspace'
             ? this.router.navigate(['../', this.routeMainMenu])
             : this.setTinyScreenWarning();
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
    const injector = this.injector;
    toObservable(component.rimHeaderHeight, {injector})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(height => this.headerHeight.set(height));
  }

}
