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
import { Car } from '../../../shared/model/car.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  addCarForm: FormGroup;
  cylinders: number[] = [4, 6, 8];
  modelYears: number[] = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  origins: string[] = ['USA', 'Europe', 'Asia'];
  @Input() btnLabel: string = 'Add New Car';
  @Input() data: Car = {
    mpg: 0,
    id: '',
    acceleration: 0,
    cylinders: 0,
    displacement: 0,
    horsepower: 0,
    weight: 0,
    modelYear: 0,
    origin: '',
    name: '',
  };
  constructor(private fb: FormBuilder, private modalService: ModalService) {
    this.addCarForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      mpg: [null, [Validators.required, Validators.min(0)]],
      cylinders: [null, Validators.required],
      displacement: [null, [Validators.required, Validators.min(0)]],
      horsepower: [null, [Validators.required, Validators.min(0)]],
      weight: [null, [Validators.required, Validators.min(0)]],
      acceleration: [null, [Validators.required, Validators.min(0)]],
      modelYear: [null, Validators.required],
      origin: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.addCarForm.valid) {
      return;
    } else {
      const newCar = this.addCarForm.value;
      this.onCloseDialog();
    }
  }
  onShowModal() {
    this.modalService.showModal('');
    if (this.data && this.data.id) {
      // Set the form values with the data from the Car object
      this.addCarForm.patchValue({
        id: this.data.id,
        name: this.data.name,
        mpg: this.data.mpg,
        cylinders: this.data.cylinders,
        displacement: this.data.displacement,
        horsepower: this.data.horsepower,
        weight: this.data.weight,
        acceleration: this.data.acceleration,
        modelYear: this.data.modelYear,
        origin: this.data.origin,
      });
    }
  }
  onCloseDialog() {
    this.modalService.hideModal();
  }
}
