import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toastService: ToastrService) {}

  showSuccess(message: string): void {
    this.toastService.success(message, 'Success');
  }
  showError(message: string): void {
    this.toastService.error(message, 'Something Went Wrong');
  }
  showWarning(message: string): void {
    this.toastService.warning(message);
  }
}
