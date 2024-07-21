import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from '../app/common/component/icon/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IconComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  title = signal('blaarkies-talks');

  constructor() {
    setInterval(() => {
      this.title = this.title.split('').sort(() => Math.round(Math.random() * 4 - 2)).join('');
    }, 1000);
  }
}
