import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-text-character-lighter',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './text-character-lighter.component.html',
  styleUrl: './text-character-lighter.component.scss',
})
export class TextCharacterLighterComponent {

  characters = input.required<string[]>();
  litCharacter = input<string | null>(null);
  litColor = input<1 | 2 | 3>(2);
  litIndex = input<number | null>(null);
  litIndexes = input<number[] | null>(null);

  userPointsAt = output<string | null>();
  userPointsAtIndex = output<number | null>();

  protected litColorClass = computed(() => {
    let litColor = this.litColor();
    if (!litColor) {
      return '';
    }

    return 'lit-color-' + litColor;
  });

  pointsAt(char: string | null, index?: number) {
    this.userPointsAt.emit(char);
    this.userPointsAtIndex.emit(index);
  }

}
