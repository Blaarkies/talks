import {
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import { toString as QrCodeToString } from 'qrcode';

@Component({
  selector: 'app-slide-end',
  standalone: true,
  imports: [
    PaneComponent,
  ],
  templateUrl: './slide-end.component.html',
  styleUrl: './slide-end.component.scss',
})
export class SlideEndComponent {

  private qrElement = viewChild('qr', {read: ElementRef<SVGElement>});

  constructor() {
    let link = 'blaarkies-talks.pages.dev';
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
