import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoggedGuard} from './guards/logged.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/core/core.module').then(m => m.CoreModule),
    canActivate: [LoggedGuard]
  },
  {
    path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
