import { Component, ElementRef, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service'; // Adjust the path as needed
import { ModalService } from '../../../core/services/modal.service';
import { Task } from '../../../shared/model/task.model';
import { CustomResponse } from '../../../shared/model/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css'],
})
export class TasklistComponent {
  tasks: Task[] = [];
  searchedTaskTitle: string = '';
  filter: any = {};
  public showAdvancedFilters: boolean = false;
  addTaskForm: FormGroup;
  priorityOptions: string[] = ['low', 'medium', 'high'];
  statusOptions: string[] = ['pending', 'in-progress', 'completed', 'overdue'];

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(
    private taskService: TaskService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService
  ) {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 7);

    this.addTaskForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      status: ['pending', Validators.required],
      dueDate: [dueDate.toISOString().substring(0, 10)],
      priority: ['low'],
      createdAt: [new Date()],
      updatedAt: [null],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  addNewTask() {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 7);
    this.addTaskForm.reset({
      id: '',
      title: '',
      description: '',
      completed: false,
      status: 'pending',
      dueDate: dueDate.toISOString().substring(0, 10),
      priority: 'low',
      createdAt: new Date(),
      updatedAt: null,
    });
    this.showDialog();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  isLoading: boolean = true;

  loadTasks(): void {
    this.isLoading = true;
    this.spinnerService.show();
    const savedFilters = localStorage.getItem('taskFilters');
    let searchParams;
    let filter;
    if (savedFilters) {
      filter = JSON.parse(savedFilters);
    }
    const taskTitle = localStorage.getItem('taskTitle');
    this.searchedTaskTitle = taskTitle ? JSON.parse(taskTitle) : '';
    searchParams = {
      ...filter,
      taskTitle: taskTitle ? JSON.parse(taskTitle) : '',
    };

    this.taskService
      .getTaskList(searchParams)
      .subscribe((res: CustomResponse) => {
        if (res.status == 'ok') {
          this.tasks = res.data;
        } else {
          this.tasks = [];
        }
        this.isLoading = false;
        this.spinnerService.hide();
      });
  }

  search(): void {
    localStorage.setItem('taskTitle', JSON.stringify(this.searchedTaskTitle));
  }

  showDialog(): void {
    this.modalService.showModal('task-modal');
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  editTask(task: Task): void {
    console.log(task);
    this.addTaskForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().substring(0, 10)
        : '',
      priority: task.priority,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
    this.showDialog();
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete ${task.title}?`)) {
      this.taskService.deleteTask(task).subscribe((res: CustomResponse) => {
        if (res.status == 'ok') {
          this.loadTasks();
          this.alertService.showSuccess('Task deleted successfully.');
        }
      });
    }
  }

  onFilterChanged(event: any) {
    this.loadTasks();
  }

  onCloseDialog() {
    this.modalService.hideModal();
  }

  onSubmit(): void {
    if (!this.addTaskForm.valid) {
      return;
    } else {
      const newTask = this.addTaskForm.value;
      if (newTask.id) {
        this.taskService
          .updateTask(newTask)
          .subscribe((res: CustomResponse) => {
            if (res.status == 'ok') {
              this.onCloseDialog();
              this.alertService.showSuccess('Task updated successfully.');
              this.loadTasks();
            } else {
              this.alertService.showError(
                'Failed to update task. Please try again later.'
              );
            }
          });
      } else {
        this.taskService.addTask(newTask).subscribe((res: CustomResponse) => {
          if (res.status == 'ok') {
            this.onCloseDialog();
            this.alertService.showSuccess('Task saved successfully.');
            this.loadTasks();
          } else {
            this.alertService.showError(
              'Failed to save task. Please try again later.'
            );
          }
        });
      }
    }
  }

  selectedFileName: string = '';
  selectedFile: any = null;

  onFileChange(event: any): void {
    const file = event.target.files[0] as File | null;
    if (file) {
      if (file.type !== 'text/csv') {
        alert('Invalid file format.');
        this.selectedFile = null;
        this.selectedFileName = '';
        return;
      }
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  selectCSV() {
    this.fileInput?.nativeElement.click();
  }

  isUploading: boolean = false;

  onUploadCSV() {
    if (this.isUploading) return;
    this.isUploading = true;
    this.taskService
      .uploadCsv(this.selectedFile)
      .subscribe((res: CustomResponse) => {
        if (res.status == 'ok') {
          alert('Data uploaded successfully.');
          this.loadTasks();
          this.selectedFile = null;
          this.selectedFileName = '';
          this.isUploading = false;
        } else {
          alert('Failed to upload data. Please try again later.');
          this.isUploading = false;
        }
      });
  }
}
