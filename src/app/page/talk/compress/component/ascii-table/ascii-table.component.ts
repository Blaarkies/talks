import {
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { makeNumberList } from '../../../../../common';
import { unprintableCharLabelMap } from '../../data/ascii-table';

@Component({
  selector: 'app-ascii-table',
  standalone: true,
  imports: [],
  templateUrl: './ascii-table.component.html',
  styleUrl: './ascii-table.component.scss',
})
export class AsciiTableComponent {

  filterTemplate = input<string[]>();
  litBinary = input<string | null>(null);

  userPointsAt = output<string>();

  protected table = computed(() => {
    let template = this.filterTemplate();
    if (template) {
      return this.makeFilteredTable(template);
    }

    return this.makeFullTable();
  });

  pointsAt(binary: string) {
    this.userPointsAt.emit(binary);
  }

  private makeFullTable(): string[][] {
    return makeNumberList(128)
      .map(n => {
        let label = unprintableCharLabelMap.get(n) ?? String.fromCharCode(n);

        let binary = n.toString(2).padStart(7, '0');
        return [label, binary];
      });
  }

  private makeFilteredTable(template: string[])
    : ReturnType<typeof this.makeFullTable> {
    return template.map(c => {
      if (!c) {
        return null;
      }

      let n = c.charCodeAt(0);
      let binary = n.toString(2).padStart(7, '0');

      return [unprintableCharLabelMap.get(n) ?? c, binary];
    });
  }
}
