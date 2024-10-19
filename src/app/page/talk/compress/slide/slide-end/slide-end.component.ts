import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { toString as QrCodeToString } from 'qrcode';
import { map } from 'rxjs';
import { routeNames } from '../../../../../../bootstrap/app.routes';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { ClickerService } from '../../../../mode-presentation/service/clicker.service';
import { PresenterNotesService } from '../../../../presenter-notes';

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

  qrData = input.required<string>();

  protected isEnded = toSignal(
    inject(ClickerService).stepAction$.pipe(
      map(v => v === 'right')));
  protected routeMainMenu = routeNames.mainMenu;

  private qrElement = viewChild('qr', {read: ElementRef<SVGElement>});

  constructor() {
    effect(() => {
      let element = this.qrElement()?.nativeElement;
      let data = this.qrData();
      if (!element || !data) {
        return;
      }

      QrCodeToString(
        data,
        {
          errorCorrectionLevel: 'M',
          margin: 0,
          color: {light: 'none'},
        }, (err, svg) => {
          if (err) {
            element.outerHTML = '<p>Error</p>';
            throw new Error(`Could not encode to QR. Data: [${data}]`, err);
          }
          let colorParsedSvg = svg
            .replaceAll(`stroke="#000000"`, `stroke="currentColor"`);
          element.outerHTML = colorParsedSvg;
        });
    });

    inject(PresenterNotesService).setSlide(10, 0);
  }

}
