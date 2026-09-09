import {
  ApplicationRef,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  ViewTransitionInfo,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { BootstrapCmp } from './bootstrap';
import { provideServiceWorker } from '@angular/service-worker';
import {
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
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
        withComponentInputBinding(),
        withViewTransitions({
          onViewTransitionCreated,
          skipInitialTransition: true,
        }),
      ),
      provideAnimations(), // TODO: remove from Talk-Compress
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
      provideHttpClient(withFetch()),
    ],
  });
}

function getLeafRoute(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let route = snapshot;

  while (route.firstChild) {
    route = route.firstChild;
  }

  return route;
}

function onViewTransitionCreated({transition, from, to}: ViewTransitionInfo)
  : void {
  const fromRoute = getLeafRoute(from);
  const toRoute = getLeafRoute(to);

  const routeConfig = fromRoute.routeConfig;
  if (!routeConfig.data) return;

  const siblings = routeConfig.data.siblings;

  const fromSlide = siblings
    .findIndex(({path}) => path === fromRoute.url.at(-1).path);
  const toSlide = siblings
    .findIndex(({path}) => path === toRoute.url.at(-1).path);

  transition.types.add(
    toSlide < fromSlide ? 'backward' : 'forward',
  );
}