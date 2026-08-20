import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Equipment, CreateEquipmentPayload, UpdateEquipmentPayload, EquipmentStatus } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private readonly url = `${environment.apiUrl}/equipments`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10, q = '', etat?: EquipmentStatus): Observable<PaginatedResponse<Equipment>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (q) params = params.set('q', q);
    if (etat) params = params.set('etat', etat);
    return this.http.get<PaginatedResponse<Equipment>>(this.url, { params });
  }

  getById(id: number): Observable<ApiResponse<Equipment>> {
    return this.http.get<ApiResponse<Equipment>>(`${this.url}/${id}`);
  }

  create(payload: CreateEquipmentPayload): Observable<ApiResponse<Equipment>> {
    return this.http.post<ApiResponse<Equipment>>(this.url, payload);
  }

  update(id: number, payload: UpdateEquipmentPayload): Observable<ApiResponse<Equipment>> {
    return this.http.put<ApiResponse<Equipment>>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
