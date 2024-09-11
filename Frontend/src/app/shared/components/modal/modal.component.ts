import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() title: string = '';
  public isVisible = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe((content) => {
      this.isVisible = !!content;
    });
  }

  close() {
    this.isVisible = false;
    setTimeout(() => this.modalService.hideModal(), 300); // Delay hiding modal to allow animation
  }
  save() {}
}
