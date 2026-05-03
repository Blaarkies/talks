import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSizedMockText } from '@talk/regex/common/mock-text';

@Component({
  selector: 'app-origins',
  imports: [
  ],
  templateUrl: './origin.html',
  styleUrl: './origin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Origin {

  private mockText = getSizedMockText(Number.MAX_SAFE_INTEGER);

  protected mockTextA = this.mockText.slice(0,553)
    .replace(/.{211}.*?\b/, t => t + `\n\n`);
  protected mockTextB = this.mockText.slice(560, 553 + 247)
    .replace(/\w/, ss => ss.toUpperCase());

}
