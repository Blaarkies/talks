import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { NeighborPreloader } from './neighbor-preloader';


export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    NeighborPreloader,
    provideRouter(
      routes,
      withPreloading(NeighborPreloader),
      withComponentInputBinding()),
    provideAnimations(),
  ],
};

