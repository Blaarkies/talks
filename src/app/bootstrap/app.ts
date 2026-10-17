import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationRef,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  ViewTransitionInfo,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { BootstrapComponent } from './c';
import { NeighborPreloader } from './neighbor-preloader';
import { routes } from './route';

export async function bootstrapApp(): Promise<ApplicationRef> {
  return bootstrapApplication(BootstrapComponent, {
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
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
      provideHttpClient(),
    ],
  });
}

function getLeafRoute(snapshot: ActivatedRouteSnapshot)
  : ActivatedRouteSnapshot | null {
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

  if (!fromRoute || !toRoute) return;

  const routeConfig = fromRoute.routeConfig;
  if (!routeConfig?.data) return;

  const unknownSiblings = routeConfig.data.siblings as object[];
  if (unknownSiblings.some(s => !('path' in s))) return;
  const siblings = unknownSiblings as { path: string }[];

  const fromSlide = siblings
    .findIndex(({path}) => path === fromRoute.url.at(-1)?.path);
  const toSlide = siblings
    .findIndex(({path}) => path === toRoute.url.at(-1)?.path);

  // @ts-ignore
  transition.types.add(
    toSlide < fromSlide ? 'backward' : 'forward',
  );
}