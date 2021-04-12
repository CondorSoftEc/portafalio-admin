import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CoreComponent} from './core.component';
import {HomeComponent} from '../home/home.component';



const routes: Routes = [
  {
    path: 'main',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      }
    ]
  },
  {path: '', redirectTo: '/main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
