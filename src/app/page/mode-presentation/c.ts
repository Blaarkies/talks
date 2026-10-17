import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  DestroyRef,
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
import { routeNames } from '@app/bootstrap/route';
import { LOCAL_STORAGE_NN } from '@app/common';
import { ButtonComponent } from '@app/common/component/button/button.component';
import Slideshow
  from '@app/page/mode-presentation/component/slideshow/c';
import { SlideDeck } from '@app/page/mode-presentation/service/slide-deck';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  fromEvent,
  map,
} from 'rxjs';
import { Clicker } from './service/clicker';
import {
  FontSizeService,
  SlideMode,
} from './service/font-size';

@Component({
  selector: 'app-mode-presentation',
  imports: [
    RouterOutlet,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  providers: [SlideDeck, Clicker],
})
export class ModePresentation {

  private storage = inject(LOCAL_STORAGE_NN);
  private keyWarning = 'tiny-screen-warning-accepted';

  protected headerHeight = signal<number | null>(null);
  protected isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(width < 1360px)')
      .pipe(map(({matches}) => matches)));
  protected warningAccepted = signal(false);
  protected routeMainMenu = routeNames.mainMenu;

  private router = inject(Router);
  private clickerService = inject(Clicker);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    const fontSizeService = inject(FontSizeService);

    fontSizeService.setSlideMode(SlideMode.presentation);
    fontSizeService.updateFontSize();

    const storageWarning = Boolean(this.storage.getItem(this.keyWarning));
    this.warningAccepted.set(storageWarning);

    fromEvent<KeyboardEvent>(inject(WA_WINDOW), 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.handleKeydown(event));
  }

  protected setTinyScreenWarning() {
    this.warningAccepted.set(true);
    this.storage.setItem(this.keyWarning, String(true));
  }

  protected handleKeydown(event: KeyboardEvent) {
    if (this.isMobile() && !this.warningAccepted()) {
      return event.key === 'backspace'
             ? this.router.navigate(['../', this.routeMainMenu])
             : this.setTinyScreenWarning();
    }
  }

  protected slideNext() {
    this.clickerService.slideNext();
  }

  protected slideBack() {
    this.clickerService.slideBack();
  }

  protected stepNext() {
    this.clickerService.stepNext();
  }

  protected stepBack() {
    this.clickerService.stepBack();
  }

  protected quit() {
    this.clickerService.quit();
  }

  protected setHeaderHeight(component: Slideshow) {
    const injector = this.injector;
    toObservable(component.rimHeaderHeight, {injector})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(height => this.headerHeight.set(height));
  }

}
