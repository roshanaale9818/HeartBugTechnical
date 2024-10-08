import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Car } from '../../shared/model/car.model';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environment.prod';
import { Task } from '../../shared/model/task.model';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}
  apiUrl: string = environments.apiUrl;
  addTask(task: Task): Observable<any> {
    return this.http.post(`${this.apiUrl}/task`, task);
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
    return this.http.get(`${this.apiUrl}/task`, { params: httpParams });
  }
  deleteTask(task: Task): Observable<any> {
    return this.http.delete(`${this.apiUrl}/task/${task.id}`);
  }
  updateTask(task: Task): Observable<any> {
    return this.http.put(`${this.apiUrl}/task/${task.id}`, task);
  }

  uploadCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload-csv`, formData);
  }
}
