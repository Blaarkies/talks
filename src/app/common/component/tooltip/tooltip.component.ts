import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';
import {
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { scriptExample } from '../../../page/presenter-notes/script-example';
import { ButtonComponent } from '../button/button.component';
import {
  BooleanAny,
  PaneComponent,
  ThemeNumberAny,
} from '../pane/pane.component';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [
    ButtonComponent,
    CdkConnectedOverlay,
    PaneComponent,
    CdkOverlayOrigin,
  ],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {

  private domSanitizer = inject(DomSanitizer);

  text = input.required<string>();
  type = input<ThemeNumberAny>(4);
  swap = input<BooleanAny>(true);

  protected unsafeHtml = computed(() => this.domSanitizer.bypassSecurityTrustHtml(this.text()));

  protected isOpen = signal(false);
  protected positions = [
    new ConnectionPositionPair(
      {originX: 'end', originY: 'top'},
      {overlayX: 'end', overlayY: 'top'}),
  ];

}
