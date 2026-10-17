import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { routeNames } from '@app/bootstrap/route';
import { PaneComponent } from '@app/common/component/pane/pane.component';
import { toString as QrCodeToString } from 'qrcode';
import { map } from 'rxjs';
import { PresenterNotesService } from '../../../presenter-notes';
import { Clicker } from '../../service/clicker';

@Component({
  selector: 'app-slide-end',
  imports: [
    PaneComponent,
    RouterLink,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
})
export default class SlideEnd {

  qrData = input.required<string>();

  protected step = inject(Clicker).registerSlide('end', 1);

  protected isEnded = computed(() => this.step());
  protected routeMainMenu = routeNames.mainMenu;

  private qrElement = viewChild<ElementRef<SVGElement>>('qr');
  private qrHostElement = viewChild<ElementRef<HTMLElement>>('qrHost');

  constructor() {
    effect(() => {
      let element = this.qrElement()?.nativeElement;
      let data = this.qrData();

      if (!element || !data) return;

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
          const colorParsedSvg = svg
            .replaceAll(`stroke="#000000"`, `stroke="currentColor"`);
          element.outerHTML = colorParsedSvg;
        });

      // Template element does not respond to changes after qrcode lib outputs
      let realQrElement = this.qrHostElement()
        ?.nativeElement
        ?.firstElementChild;
      if (!realQrElement || !(realQrElement instanceof SVGElement)) return;

      realQrElement.style.setProperty('height', '60vh');
    });
  }

}
