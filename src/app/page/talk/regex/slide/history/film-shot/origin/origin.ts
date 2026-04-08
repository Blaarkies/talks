import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSizedMockText } from '@talk/regex/slide/teaser/data';

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

}
