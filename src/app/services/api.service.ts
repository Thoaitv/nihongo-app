import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:9093';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(payload: {
    name: string;
    email: string;
    username: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/crm/register`, payload);
  }

  listTopics(page: number = 1, limit: number = 20) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get(`${this.baseUrl}/topics`, { params });
  }
  createTopic(payload: {
    name: string;
    code: string;
    description: string;
  }): Observable<any> {
    const requestPayload = {
      name: payload.name,
      code: this.generateUUID(),
      description: payload.description,
    };
    return this.http.post(`${this.baseUrl}/topic`, requestPayload);
  }

  updateTopic(
    id: number,
    payload: {
      name: string;
      description: string;
    }
  ): Observable<any> {
    const requestPayload = {
      name: payload.name,
      description: payload.description,
    };
    return this.http.put(`${this.baseUrl}/topic/${id}`, requestPayload);
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/topic/${id}`);
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  listVocabularies(page: number = 1, limit: number = 20) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get(`${this.baseUrl}/vocabularies`, { params });
  }

  createVocabulary(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/vocabulary`, formData);
  }

  // EXAM
  getExams(limit: number = 10, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/exams?limit=${limit}&page=${page}`);
  }

  createExam(exam: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/exam`, exam);
  }

  getExamDetail(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/exam/${id}/questions`);
  }

  updateExam(id: number, exam: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/exam/${id}`, exam);
  }

  getUsers(limit: number, page: number): Observable<any> {
    const params = { limit, page };
    return this.http.get(`${this.baseUrl}/users`, { params });
  }

  getListenings(limit: number = 10, page: number = 1): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/listenings?limit=${limit}&page=${page}`
    );
  }
   getReadings(limit: number = 10, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/readings?limit=${limit}&page=${page}`);
  }
}
