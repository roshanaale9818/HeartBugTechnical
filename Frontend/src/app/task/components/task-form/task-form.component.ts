import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '../../../core/services/modal.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { Task } from '../../../shared/model/task.model';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    SharedModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  addTaskForm: FormGroup;
  priorityOptions: string[] = ['low', 'medium', 'high'];
  statusOptions: string[] = ['pending', 'in-progress', 'completed', 'overdue'];

  @Input() btnLabel: string = 'Add New Task';
  @Input() data: Task = {
    id: '',
    title: '',
    description: '',
    completed: false,
    status: 'pending',
    priority: 'medium',
    dueDate: undefined,
    createdAt: new Date(),
  };

  constructor(private fb: FormBuilder, private modalService: ModalService) {
    this.addTaskForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      status: ['pending', Validators.required],
      priority: ['medium', Validators.required],
      dueDate: [null],
      completed: [false],
      createdAt: [new Date(), Validators.required],
      updatedAt: [null],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.addTaskForm.valid) {
      return;
    } else {
      const newTask = this.addTaskForm.value;
      this.onCloseDialog();
    }
  }

  onShowModal() {
    this.modalService.showModal('');
    if (this.data && this.data.id) {
      // Set the form values with the data from the Task object
      this.addTaskForm.patchValue({
        id: this.data.id,
        title: this.data.title,
        description: this.data.description,
        status: this.data.status,
        priority: this.data.priority,
        dueDate: this.data.dueDate,
        completed: this.data.completed,
        createdAt: this.data.createdAt,
        updatedAt: this.data.updatedAt,
      });
    }
  }

  onCloseDialog() {
    this.modalService.hideModal();
  }
}
