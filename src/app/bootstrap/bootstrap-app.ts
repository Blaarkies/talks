import {
  ApplicationRef,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { BootstrapCmp } from './bootstrap';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NeighborPreloader } from './neighbor-preloader';
import { routes } from './routes';

export async function bootstrapApp(): Promise<ApplicationRef> {
  return bootstrapApplication(BootstrapCmp, {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideZonelessChangeDetection(),
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
