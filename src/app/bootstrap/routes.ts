import { Routes } from '@angular/router';

export const routeNames = {
  mainMenu: 'main-menu',
  interact: 'interactive',
  present: 'presentation',
  presenterNotes: 'presenter-notes',
};

export const routes: Routes = [
  {
    path: routeNames.mainMenu,
    loadComponent: () => import('../page/main-menu/main-menu.component')
      .then(m => m.MainMenuComponent),
  },
  {
    path: routeNames.present,
    loadComponent: () => import('../page/mode-presentation')
      .then(m => m.ModePresentationComponent),
    loadChildren: () => import('../page/mode-presentation')
      .then(m => m.routes),
  },
  {
    path: routeNames.interact,
    loadComponent: () => import('../page/mode-interactive')
      .then(m => m.ModeInteractiveComponent),
    loadChildren: () => import('../page/mode-interactive')
      .then(m => m.routes),
  },
  {
    path: routeNames.presenterNotes,
    loadComponent: () => import('../page/presenter-notes')
      .then(m => m.PresenterNotesComponent),
  },

  {
    path: '**',
    redirectTo: routeNames.mainMenu,
  },
];
