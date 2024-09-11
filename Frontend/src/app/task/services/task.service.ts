import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Car } from '../../shared/model/car.model';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}
  apiUrl: string = environments.apiUrl;
  addTask(car: Car): Observable<any> {
    return this.http.post(`${this.apiUrl}/car`, car);
  }
  getTaskList(params: any): Observable<any> {
    let httpParams = new HttpParams();

    // Add each parameter to the HttpParams object if it exists
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    // Make the GET request with the query parameters
    return this.http.get(`${this.apiUrl}/car`, { params: httpParams });
  }
  deleteTask(car: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/car/${car.id}`);
  }
  updateTask(car: Car): Observable<any> {
    return this.http.put(`${this.apiUrl}/car/${car.id}`, car);
  }

  uploadCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload-csv`, formData);
  }
}
