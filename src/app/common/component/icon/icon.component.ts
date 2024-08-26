import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  ValueProvider,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
  ICON_COMPONENT_CONFIG,
  ICON_MAP,
  IconAlias,
} from './';
import { defaultConfig } from './token';
import { IconComponentConfig } from './type';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: '',
})
export class IconComponent {

  static provideDefaultConfig(config: IconComponentConfig): ValueProvider {
    let finalConfig = Object.assign(defaultConfig, config);
    return {provide: ICON_COMPONENT_CONFIG, useValue: finalConfig};
  }

  private defaults = inject(ICON_COMPONENT_CONFIG);
  name = input<IconAlias>();
  size = input<number>(this.defaults.size);

  private icons = inject(ICON_MAP);
  private html = toSignal(
    toObservable(this.name).pipe(
      map(name => this.icons.get(name)),
      switchMap(name => name ? this.getSvgHtml(name) : of(null)),
    ),
  );
  private renderer2 = inject(Renderer2);
  private self = inject(ElementRef);

  constructor() {
    effect(() => {
      let html = this.html();
      if (!html) {
        return;
      }

      this.renderer2
        .setProperty(this.self.nativeElement, 'innerHTML', html);

      let element: SVGElement = this.self.nativeElement
        .querySelector('svg');

      let size = this.size().toString();
      this.renderer2.setAttribute(element, 'width', size);
      this.renderer2.setAttribute(element, 'height', size);

      // this.renderer2.setAttribute(element, 'fill',
      //   'var(--icon-fill-3)');
      // this.renderer2.setAttribute(element, 'stroke',
      //   'var(--icon-stroke-3)');
      // this.renderer2.setAttribute(element, 'stroke-width',
      //   'var(--icon-stroke-width-3)');
    });
  }

  private getSvgHtml(path: string): Observable<string> {
    let filePromise = fetch(path, {headers: {responseType: 'text'}})
      .then(r => r.text());
    return fromPromise(filePromise);
  }

}
