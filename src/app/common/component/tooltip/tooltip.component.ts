import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';
import {
  Component,
  input,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { PaneComponent } from '../pane/pane.component';

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

  text = input.required<string>();

  protected isOpen = signal(false);
  protected positions = [
    new ConnectionPositionPair(
      {originX: 'end', originY: 'top'},
      {overlayX: 'end', overlayY: 'top'}),
  ];

}
