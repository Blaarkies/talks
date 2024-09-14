import {
  Component,
  input,
  output,
} from '@angular/core';
import { LzwStep } from '../../../common';

@Component({
  selector: 'app-lzw-dictionary',
  standalone: true,
  imports: [],
  templateUrl: './lzw-dictionary.component.html',
  styleUrl: './lzw-dictionary.component.scss',
})
export class LzwDictionaryComponent {

  dictionary = input<LzwStep[]>();
  activeStep = input<LzwStep>();
  litStep = input<LzwStep>();

  userPointsAt = output<LzwStep | null>();

  protected pointsAt(step: LzwStep) {
    this.userPointsAt.emit(step);
  }

}
