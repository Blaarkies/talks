import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

// What it IS:
//    Pattern matching, text searching, validation
// What it IS NOT:
//    A programming language,
//    A code parser (don't parse HTML/XML/.etc)
//

@Component({
  selector: 'app-definition',
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './definition.html',
  styleUrl: './definition.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Definition {


}
