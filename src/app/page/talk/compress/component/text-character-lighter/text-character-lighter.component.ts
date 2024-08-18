import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextCharacterLighterComponent {

  characters = input.required<string[]>();
  litCharacter = input<string | null>(null);
  litColor = input<1 | 2 | 3>(2);

  userPointsAt = output<string>();

  protected litColorClass = computed(() => {
    let litColor = this.litColor();
    if (!litColor) {
      return '';
    }

    return 'lit-color-' + litColor;
  });

  pointsAt(char: string | null) {
    this.userPointsAt.emit(char);
  }

}
