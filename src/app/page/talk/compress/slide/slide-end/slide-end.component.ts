import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { map } from 'rxjs';
import { routeNames } from '../../../../../../bootstrap/app.routes';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { toString as QrCodeToString } from 'qrcode';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';

@Component({
  selector: 'app-slide-end',
  standalone: true,
  imports: [
    PaneComponent,
    RouterLink,
  ],
  templateUrl: './slide-end.component.html',
  styleUrl: './slide-end.component.scss',
})
export class SlideEndComponent {

  protected isEnded = toSignal(
    inject(ClickerService).stepAction$.pipe(
      map(v => v === 'right')));
  protected routeMainMenu = routeNames.mainMenu;

  private qrElement = viewChild('qr', {read: ElementRef<SVGElement>});

  constructor() {
    let link = 'blaarkies-talks.pages.dev/interactive/compression';
    let svgHtml = signal<string | null>(null);

    QrCodeToString(
      link,
      {
        errorCorrectionLevel: 'M',
        margin: 0,
        color: {light: 'none'},
      }, (err, svg) => {
        let colorParsedSvg = svg
          .replaceAll(`stroke="#000000"`, `stroke="currentColor"`);
        svgHtml.set(colorParsedSvg);
      });

    effect(() => {
      if (!this.qrElement() || !svgHtml()) {
        return;
      }
      this.qrElement().nativeElement.outerHTML = svgHtml();
    });

  }

}
