import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

// Ng-Zorro imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router } from '@angular/router';

interface ListeningLesson {
  id: number;
  title: string;
  lessonType: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  httpCode: number;
  data: {
    list: ListeningLesson[];
    num: number;
    totalPage: number;
    currentPage: number;
  };
  errorCode: string;
}
@Component({
  selector: 'app-learn-listening',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NzCardModule,
    NzListModule,
    NzButtonModule,
    NzPaginationModule,
    NzSpinModule,
    NzTagModule,
    NzGridModule,
    NzTypographyModule,
    NzDividerModule,
  ],
  templateUrl: './learn-listening.component.html',
  styleUrl: './learn-listening.component.scss',
})
export class LearnListeningComponent implements OnInit {
  private readonly router = inject(Router);
  lessons: ListeningLesson[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalLessons = 0;
  totalPages = 1;

  private apiUrl = 'http://localhost:9093/listenings';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons(): void {
    this.loading = true;
    const params = {
      limit: this.pageSize.toString(),
      page: this.currentPage.toString(),
    };

    this.http.get<ApiResponse>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        if (response.status) {
          this.lessons = response.data.list;
          this.totalLessons = response.data.num;
          this.totalPages = response.data.totalPage;
          this.currentPage = response.data.currentPage;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading lessons:', error);
        this.loading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLessons();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadLessons();
  }

  selectLesson(lesson: ListeningLesson): void {
    this.router.navigate(['/student/listening', lesson.id]);
  }

  trackByFn(index: number, item: ListeningLesson): number {
    return item.id;
  }
}
