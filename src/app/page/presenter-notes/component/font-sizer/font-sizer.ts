import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
  output,
} from '@angular/core';
import {
  chars,
  lerp,
} from '@app/common';
import { ButtonComponent } from '@component/button/button.component';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

@Component({
  selector: 'app-font-sizer',
  imports: [
    ButtonComponent,
  ],
  templateUrl: './font-sizer.html',
  styleUrl: './font-sizer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontSizer {

  private storage = inject(WA_LOCAL_STORAGE);
  private key = 'presenter-font-size';
  private fontLimits: [number, number] = [.5, 2.5];

  fontSized = output<number>();

  protected icons = chars;
  protected fontSize = linkedSignal(() => {
    const saved = this.storage.getItem(this.key);
    if (saved === null) return lerp(...this.fontLimits);

    return Number(this.storage.getItem(this.key));
  });

  protected sizeFont(increment: number) {
    const s = this.fontSize();
    if (s <= this.fontLimits[0] && increment < 0) return;
    if (s >= this.fontLimits[1] && increment > 0) return;

    this.fontSize.update(v => (v ?? 1) + increment / 8);
    this.storage.setItem(this.key, this.fontSize().toString());
  }

  constructor() {
    effect(() => this.fontSized.emit(this.fontSize()));
  }

}
