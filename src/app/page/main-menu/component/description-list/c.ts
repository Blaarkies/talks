import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NavigationOption } from '@app/page/main-menu/data/navigation-options';
import { PaneComponent } from '@component/pane/pane.component';

@Component({
  selector: 'app-description-list',
  imports: [
    PaneComponent,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionList {

  navigationOption = input.required<NavigationOption>();

}
