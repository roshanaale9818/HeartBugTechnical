import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../model/user.model';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environment.prod';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  user: User = {
    id: 1,
    name: 'John Connor',
    email: 'john.doe@example.com',
    profileImage: '',
    role: 'user',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-09-01T10:00:00Z'),
  };
  apiUrl: string = environments.apiUrl;
  onDownload() {
    try {
      this.http
        .get(`${this.apiUrl}/download-csv`, {
          responseType: 'blob', // Important for file downloads
        })
        .subscribe((response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'cars.csv';
          link.click();
          window.URL.revokeObjectURL(url);
          alert('Download successfull.');
        });
    } catch (er) {
      alert('Something went wrong.');
    }
  }
  constructor(private http: HttpClient) {}
  onProfile() {
    console.error('not implemented yet.');
  }
}
