import { InjectionToken } from '@angular/core';

export const PIXELATOR_ID = new InjectionToken(
  'Unique Id generator for svg ids',
  {
    providedIn: 'root',
    factory: () => {
      let id = 0;
      return () => `pixelate-${id++}`;
    },
  },
);
