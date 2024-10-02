import { BreakpointObserver } from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface MakeScreenSelectorSignalConfig {
  width: number;
}
export function makeScreenSelectorSignal(
  configInput?: Partial<MakeScreenSelectorSignalConfig>) {
  let defaults: MakeScreenSelectorSignalConfig
    = {width: 1000};
  let config: MakeScreenSelectorSignalConfig
    = Object.assign(defaults, configInput ?? {});

  return toSignal(
    inject(BreakpointObserver)
      .observe(`(width < ${config.width}px)`)
      .pipe(map(({matches}) => matches)));
}