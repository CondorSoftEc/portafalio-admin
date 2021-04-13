import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoreRoutingModule} from './core-routing.module';
import {CoreComponent} from './core.component';
import {AlertModule} from '../../_alert';
import {HomeComponent} from '../home/home.component';

import {FormsModule} from '@angular/forms';
import {FilterPipe} from '../../pipes/filter.pipe';



@NgModule({
    declarations: [
        CoreComponent,
        HomeComponent,
        FilterPipe,
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
