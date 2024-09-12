import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../core/services/modal.service';
import { TaskService } from '../../../task/services/task.service';
import { Task } from '../../../shared/model/task.model';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  addTaskForm: FormGroup;
  isSubmitting: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private taskService: TaskService,
    private alertService: AlertService
  ) {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 7);
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      status: ['pending', Validators.required],
      dueDate: [dueDate.toISOString().substring(0, 10)],
      priority: ['low'],
      createdAt: [new Date(), Validators.required],
      updatedAt: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.addTaskForm.valid) {
      return;
    } else {
      this.isSubmitting = true;
      const newTask: Task = this.addTaskForm.value;
      this.onCloseDialog();
      this.taskService.addTask(newTask).subscribe((response) => {
        if (response.status === 'ok') {
          this.alertService.showSuccess('Task added successfull');
          this.isSubmitting = false;
          const today = new Date();
          const dueDate = new Date(today);
          dueDate.setDate(today.getDate() + 7);
          this.addTaskForm.reset({
            title: '',
            description: '',
            completed: false,
            status: 'pending',
            dueDate: dueDate.toISOString().substring(0, 10),
            priority: 'low',
            createdAt: new Date(),
            updatedAt: '',
          });
        } else {
          this.alertService.showError('Saving failed. Please try again later.');
          this.isSubmitting = false;
        }
      });
    }
  }

  onShowModal() {
    this.modalService.showModal('Task Form');
  }

  onCloseDialog() {
    this.modalService.hideModal();
  }
}
