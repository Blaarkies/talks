import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { routeNames } from '../../../bootstrap/app.routes';
import { slideRouteNames } from '../mode-presentation/route';

let options = {
  compression: {
    label: 'What is Compression?',
    url: slideRouteNames.compression,
  },
  imageProcessing: {
    label: 'An image is worth 1000 pixels',
    url: slideRouteNames.imageProcessing,
  },
  asdf: {
    label: 'Using a Hard Disk',
    url: 'asdfasdfs',
  },
};

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {

  routeNames = routeNames;

  protected navigations = signal(options);
  protected navigationsList = computed(() => Object.values(this.navigations()));

  protected selectedOption = signal<typeof options['compression']>(null);

  private router = inject(Router);

  selectNext(step: number) {
    let list = this.navigationsList();
    let index = list.indexOf(this.selectedOption());
    if (index === -1) {
      return this.selectedOption.set(list[0]);
    }

    index = (index + step) % list.length;
    index = index > -1 ? index : list.length - 1;

    this.selectedOption.set(list[index]);
  }

  async launchSelected() {
    let url = this.selectedOption().url;
    await this.router.navigate(['../', routeNames.present, url]);
  }
}
