import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Assignment, CreateAssignmentPayload, ReturnAssignmentPayload } from '../models/assignment.model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly url = `${environment.apiUrl}/assignments`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10, active?: boolean): Observable<PaginatedResponse<Assignment>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (active !== undefined) params = params.set('active', String(active));
    return this.http.get<PaginatedResponse<Assignment>>(this.url, { params });
  }

  getById(id: number): Observable<ApiResponse<Assignment>> {
    return this.http.get<ApiResponse<Assignment>>(`${this.url}/${id}`);
  }

  create(payload: CreateAssignmentPayload): Observable<ApiResponse<Assignment>> {
    return this.http.post<ApiResponse<Assignment>>(this.url, payload);
  }

  returnEquipment(id: number, payload: ReturnAssignmentPayload = {}): Observable<ApiResponse<Assignment>> {
    return this.http.post<ApiResponse<Assignment>>(`${this.url}/${id}/return`, payload);
  }
}
