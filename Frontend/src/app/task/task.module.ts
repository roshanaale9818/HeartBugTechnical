import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { TasklistComponent } from './components/tasklist/tasklist.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';

@NgModule({
  declarations: [TasklistComponent, TaskFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskRoutingModule,
    TaskFormComponent,
    ModalComponent,
    SharedModule,
  ],
  exports: [TaskFilterComponent],
})
export class TaskModule {}
