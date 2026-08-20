import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Employee, CreateEmployeePayload, UpdateEmployeePayload } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly url = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10, q = ''): Observable<PaginatedResponse<Employee>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (q) params = params.set('q', q);
    return this.http.get<PaginatedResponse<Employee>>(this.url, { params });
  }

  getById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.url}/${id}`);
  }

  create(payload: CreateEmployeePayload): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.url, payload);
  }

  update(id: number, payload: UpdateEmployeePayload): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
