import { Component } from '@angular/core';
import { CoinFlipWorldComponent } from './coin-flip-world/coin-flip-world.component';

@Component({
  selector: 'app-slide-calculating-entropy',
  standalone: true,
  imports: [
    CoinFlipWorldComponent,
  ],
  templateUrl: './slide-calculating-entropy.component.html',
  styleUrl: './slide-calculating-entropy.component.scss',
})
export class SlideCalculatingEntropyComponent {

}
