import {
  ApplicationRef,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NeighborPreloader } from './neighbor-preloader';

export async function bootstrapApp(): Promise<ApplicationRef> {
  return bootstrapApplication(AppComponent, {
    providers: [
      // provideBrowserGlobalErrorListeners(),
      provideExperimentalZonelessChangeDetection(),
      // provideZonelessChangeDetection(),
      NeighborPreloader,
      provideRouter(
        routes,
        withPreloading(NeighborPreloader),
        withComponentInputBinding()),
      provideAnimations(),
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
      provideHttpClient(withFetch()),
    ],
  });
}
