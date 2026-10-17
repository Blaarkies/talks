import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  outputFromObservable,
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { routeNames } from '@app/bootstrap/route';
import { chars } from '@app/common';
import {
  SelectionList,
  SelectionListOption,
} from '@app/page/main-menu/component/selection-list/c';
import {
  NavigationOption,
  navigationOptions,
  VenueSelection,
} from '@app/page/main-menu/data/navigation-options';
import { SlideMode } from '@app/page/mode-presentation/service/font-size';
import { ButtonComponent } from '@component/button/button.component';
import { PaneComponent } from '@component/pane/pane.component';
import { WA_WINDOW } from '@ng-web-apis/common';
import {
  filter,
  fromEvent,
} from 'rxjs';

@Component({
  selector: 'app-main-selector',
  imports: [
    RouterLink,
    SelectionList,
    ButtonComponent,
  ],
  templateUrl: './c.html',
  styleUrl: './c.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSelector {

  private router = inject(Router);

  mode = input.required<SlideMode>();

  private list = viewChild(SelectionList);

  protected options = computed(() => {
    const p = this.mode() === SlideMode.presentation;
    const modeUrl = p ? routeNames.present : routeNames.interact;
    return Object.values(navigationOptions)
      .map(o => (<SelectionListOption<NavigationOption>>{
        label: o.label,
        data: {
          ...o,
          url: ['..', modeUrl, o.url].join('/'),
          venues: p ? o.venues : undefined,
        },
      }));
  });

  protected selectedOption = linkedSignal(() => this.options()[0]);

  selectOption = outputFromObservable(toObservable(this.selectedOption));
  openVenueSelector = output<null | VenueSelection[]>();

  setDisabled(v: boolean) {
    this.list().setDisabled(v);
  }

  protected chars = chars;

  protected launchSelected(url: string) {
    if (!url) return;

    void this.router.navigate([url]);
  }

  protected selectorExit(
    selector: SelectionList<NavigationOption>,
    v: false | SelectionListOption<NavigationOption>) {
    if (v === false) return this.openVenueSelector.emit(null);

    if (v.data.venues?.length) {
      return this.openVenueSelector.emit(this.selectedOption()?.data.venues);
    }

    selector.setDisabled(false);
  }
}
