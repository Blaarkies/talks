import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { InjectionToken } from '@angular/core';

export const SHARED_RESIZE_OBSERVER = new InjectionToken(
  'Shared Resize Observer',
  {
    providedIn: 'root',
    factory: () => new SharedResizeObserver(),
  },
);
