import {
  CdkMenu,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';
import {
  Component,
  computed,
  effect,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../common/component/button/button.component';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';

function toggle(value: boolean) {
  return !value;
}

type EncodingFn = (input: string) => string;

@Component({
  selector: 'app-custom-input-encoder-decoder',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    PaneComponent,
    CdkMenuTrigger,
    CdkMenu,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
  ],
  templateUrl: './custom-input-encoder-decoder.component.html',
  styleUrl: './custom-input-encoder-decoder.component.scss',
})
export class CustomInputEncoderDecoderComponent {

  example = input('Example text');
  information = input<string | null>(null);
  headerDecoded = input('Decoded Data');
  headerEncoded = input('Encoded Data');
  encodeFn = input.required<EncodingFn>();
  decodeFn = input<EncodingFn | null>(null);

  protected inputValue = model('');
  protected outputValue = computed(() => {
    let input = this.inputValue();
    if (!input) {
      return;
    }

    return this.decodeMode()
           ? this.decodeFn()(input)
           : this.encodeFn()(input);
  });
  protected headerForInput = computed(() =>
    this.decodeMode() ? this.headerEncoded() : this.headerDecoded());
  protected headerForOutput = computed(() =>
    this.decodeMode() ? this.headerDecoded() : this.headerEncoded());

  protected isInfoOpen = signal(false);
  protected positions = [
    new ConnectionPositionPair(
      {originX: 'end', originY: 'top'},
      {overlayX: 'end', overlayY: 'top'}),
  ];

  private decodeMode = signal(false);

  constructor() {
    effect(() => this.inputValue.set(this.example()),
      {allowSignalWrites: true});
  }

  protected toggleDecodeMode() {
    let input = this.inputValue();
    let codingFn = this.decodeMode()
                   ? this.decodeFn()
                   : this.encodeFn();
    this.inputValue.set(codingFn(input));

    this.decodeMode.update(toggle);
  }
}
