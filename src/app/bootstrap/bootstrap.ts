import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './bootstrap.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootstrapCmp {
}
