import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-filter',
  templateUrl: './car-filter.component.html',
  styleUrls: ['./car-filter.component.css'],
})
export class CarFilterComponent {
  filterForm: FormGroup;
  cylinders: number[] = [0, 4, 6, 8];
  modelYears: number[] = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  origins: string[] = ['usa', 'europe', 'asia', 'japan'];
  private readonly storageKey = 'searchFilters';
  @Output() filterChanged = new EventEmitter<any>();
  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe((filters) => {
      this.applyFilters();
    });
    this.loadFilters();
  }

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      selectedCylinder: [null],
      selectedModelYear: [null],
      selectedOrigin: [null],
    });
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
