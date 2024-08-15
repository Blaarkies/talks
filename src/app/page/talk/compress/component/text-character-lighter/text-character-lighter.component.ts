import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-text-character-lighter',
  standalone: true,
  imports: [],
  templateUrl: './text-character-lighter.component.html',
  styleUrl: './text-character-lighter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextCharacterLighterComponent {

  characters = input.required<string[]>();
  litCharacter = input<string | null>(null);

  userPointsAt = output<string>();

  pointsAt(char: string | null) {
    this.userPointsAt.emit(char);
  }

}
