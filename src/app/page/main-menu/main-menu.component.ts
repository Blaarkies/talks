import {
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
import { PaneComponent } from '../../common/component/pane/pane.component';
import { RimComponent } from '../../common/component/rim/rim.component';
import {
  NavigationOption,
  navigationOptions,
} from './data/navigation-options';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    RouterLink,
    PaneComponent,
    RimComponent,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {

  protected routeNames = routeNames;
  protected navigations = signal(navigationOptions);
  protected navigationsList = computed(() => Object.values(this.navigations()));
  protected selectedOption = signal<NavigationOption>(null);

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
    let url = this.selectedOption()?.url;
    if (!url) {
      return;
    }
    await this.router.navigate(['../', routeNames.present, url]);
  }

}
