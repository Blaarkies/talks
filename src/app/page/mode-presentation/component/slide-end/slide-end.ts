import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { routeNames } from '@app/bootstrap/routes';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { toString as QrCodeToString } from 'qrcode';
import { map } from 'rxjs';
import { PresenterNotesService } from '../../../presenter-notes';
import { ClickerService } from '../../service/clicker.service';

@Component({
  selector: 'app-slide-end',
  imports: [
    PaneComponent,
    RouterLink,
  ],
  templateUrl: './slide-end.html',
  styleUrl: './slide-end.scss',
})
export default class SlideEnd {

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

    inject(PresenterNotesService).setSlide('end', 0);
  }

}
