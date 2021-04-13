import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectEditRoutingModule } from './project-edit-routing.module';
import { ProjectEditComponent } from './project-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ProjectEditComponent],
  imports: [
    CommonModule,
    ProjectEditRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProjectEditModule { }
