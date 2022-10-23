import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./sessions/sessions.module').then((m) => m.SessionsModule),
  },
];

export const AppRoutes = RouterModule.forRoot(routes, {
  useHash: false,
  preloadingStrategy: PreloadAllModules,
});
