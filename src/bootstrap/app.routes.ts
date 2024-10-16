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
    loadComponent: () => import('../app/page/main-menu/main-menu.component')
      .then(m => m.MainMenuComponent),
  },
  {
    path: routeNames.present,
    loadComponent: () => import('../app/page/mode-presentation')
      .then(m => m.ModePresentationComponent),
    loadChildren: () => import('../app/page/mode-presentation')
      .then(m => m.routes),
  },
  {
    path: routeNames.interact,
    loadComponent: () => import('../app/page/mode-interactive')
      .then(m => m.ModeInteractiveComponent),
    loadChildren: () => import('../app/page/mode-interactive')
      .then(m => m.routes),
  },
  {
    path: routeNames.presenterNotes,
    loadComponent: () => import('../app/page/presenter-notes')
      .then(m => m.PresenterNotesComponent),
  },

  {
    path: '**',
    redirectTo: routeNames.mainMenu,
  },
];
