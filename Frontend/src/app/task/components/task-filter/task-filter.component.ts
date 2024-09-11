import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Task } from './../../../shared/model/task.model';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css'],
})
export class TaskFilterComponent {
  filterForm: FormGroup;
  statusOptions: string[] = ['pending', 'in-progress', 'completed', 'overdue'];
  priorityOptions: string[] = ['low', 'medium', 'high'];
  private readonly storageKey = 'taskFilters';

  @Output() filterChanged = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    // Set default values for the filters
    this.filterForm = this.fb.group({
      title: [''], // Default empty string for task title
      status: ['pending'], // Default status is 'pending'
      priority: ['medium'], // Default priority is 'medium'
      dueDate: [null], // Default no due date
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    this.loadFilters();
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    localStorage.setItem(this.storageKey, JSON.stringify(filters));
    this.filterChanged.emit(filters);
  }

  loadFilters(): void {
    const savedFilters = localStorage.getItem(this.storageKey);
    if (savedFilters) {
      this.filterForm.setValue(JSON.parse(savedFilters));
    }
  }
}
