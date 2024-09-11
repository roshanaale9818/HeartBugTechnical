import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalSubject = new BehaviorSubject<any>('');

  modalState$ = this.modalSubject.asObservable();

  showModal(content: any) {
    this.modalSubject.next(content);
  }

  hideModal() {
    this.modalSubject.next(null);
  }
}
