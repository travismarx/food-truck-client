import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SessionsComponent } from './sessions/sessions.component';
import { SessionPageComponent } from './sessions/session-page/session-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sessions',
    pathMatch: 'full',
  },
  {
    path: 'sessions',
    // component: SessionsComponent,
    children: [
      {
        path: '',
        component: SessionsComponent,
      },
      {
        path: ':id',
        component: SessionPageComponent,
      },
    ],
  },
  {
    path: '404',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
