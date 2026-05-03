import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  DefaultValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
})
export class Checkbox implements ControlValueAccessor {

  label = input<string>();

  protected checked = signal(false);
  protected disabled = signal(false);

  private onChange = (value: boolean) => void 0;
  private onTouched = () => void 0;

  writeValue(value: boolean) {
    this.checked.set(value);
  }

  registerOnChange(fn: (value: boolean) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  protected onInputChange(value: boolean) {
    this.checked.set(value);
    this.onChange(value);
    this.onTouched();
  }

}
