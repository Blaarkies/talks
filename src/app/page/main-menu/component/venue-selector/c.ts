import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { chars } from '@app/common';
import {
  SelectionList,
  SelectionListOption,
} from '@app/page/main-menu/component/selection-list/c';
import { VenueSelection } from '@app/page/main-menu/data/navigation-options';
import { ButtonComponent } from '@component/button/button.component';

@Component({
  selector: 'app-venue-selector',
  imports: [
    SelectionList,
    RouterLink,
    ButtonComponent,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueSelector {

  private router = inject(Router);

  talk = input.required<string>();
  options = input.required<VenueSelection[]>();

  exit = output<void>();

  protected trimmedName = computed(() => {
    const name = this.talk();
    const extra = name.length > 10 ? '...' : '';
    return name.slice(0, 10).toUpperCase() + extra;
  });

  protected venues = computed(() => {
    return this.options().map(o => (<SelectionListOption<{ url: string }>>{
      label: o.text,
      data: {
        url: o.url,
      },
    }));
  });

  protected chars = chars;

  protected launchSelected(url: string) {
    if (!url) return;

    void this.router.navigate([url]);
  }

}
