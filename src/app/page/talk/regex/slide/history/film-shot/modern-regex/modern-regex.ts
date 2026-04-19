import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-modern-regex',
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './modern-regex.html',
  styleUrl: './modern-regex.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModernRegex {

}
