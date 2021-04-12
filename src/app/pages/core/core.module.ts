import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoreRoutingModule} from './core-routing.module';
import {CoreComponent} from './core.component';
import {AlertModule} from '../../_alert';
import {HomeComponent} from '../home/home.component';

import {FormsModule} from '@angular/forms';



@NgModule({
    declarations: [
        CoreComponent,
        HomeComponent,
    ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    AlertModule,
    FormsModule
  ]
})
export class CoreModule {
}
