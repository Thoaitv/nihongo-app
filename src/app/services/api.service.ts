import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${environment.apiUrl}/login`, data);
  }

  register(payload: {
    name: string;
    email: string;
    username: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/register`, payload);
  }

  listTopics(page: number = 1, limit: number = 20) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get(`${environment.apiUrl}/topics`, { params });
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
    return this.http.post(`${environment.apiUrl}/topic`, requestPayload);
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
    return this.http.put(`${environment.apiUrl}/topic/${id}`, requestPayload);
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/topic/${id}`);
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
    return this.http.get(`${environment.apiUrl}/vocabularies`, { params });
  }

  createVocabulary(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/vocabulary`, formData);
  }

  // EXAM
  getExams(limit: number = 10, page: number = 1): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/exams?limit=${limit}&page=${page}`
    );
  }

  createExam(exam: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/exam`, exam);
  }

  getExamDetail(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/exam/${id}/questions`);
  }

  updateExam(id: number, exam: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/exam/${id}`, exam);
  }

  getUsers(limit: number, page: number): Observable<any> {
    const params = { limit, page };
    return this.http.get(`${environment.apiUrl}/users`, { params });
  }

  getListenings(limit: number = 10, page: number = 1): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/listenings?limit=${limit}&page=${page}`
    );
  }
  getReadings(limit: number = 10, page: number = 1): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/readings?limit=${limit}&page=${page}`
    );
  }

  getListVoca(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/filter/topics`);
  }
}
