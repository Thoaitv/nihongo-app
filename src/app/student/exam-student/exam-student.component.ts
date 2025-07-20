// exam-list.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// ng-zorro imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzFlexModule } from 'ng-zorro-antd/flex';

interface Exam {
  id: number;
  title: string;
  description: string;
}

interface ExamResponse {
  status: boolean;
  message: string;
  httpCode: number;
  data: {
    list: Exam[];
    num: number;
    totalPage: number;
    currentPage: number;
  };
  errorCode: string;
}

@Component({
  selector: 'app-exam-student',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzPaginationModule,
    NzSpinModule,
    NzEmptyModule,
    NzTagModule,
    NzDividerModule,
    NzTypographyModule,
    NzSpaceModule,
    NzFlexModule,
  ],
  templateUrl: './exam-student.component.html',
  styleUrl: './exam-student.component.scss',
})
export class ExamStudentComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signals
  examList = signal<Exam[]>([]);
  loading = signal(false);
  totalExams = signal(0);

  // Pagination
  currentPage = 1;
  pageSize = 1999;
  pageSizeOptions = [5, 10, 20, 50];

  // Search
  searchTerm = '';

  // API URL
  private baseUrl = 'http://localhost:9093';

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading.set(true);

    const params = new URLSearchParams({
      limit: this.pageSize.toString(),
      page: this.currentPage.toString(),
    });

    this.http
      .get<ExamResponse>(`${this.baseUrl}/exams?${params.toString()}`)
      .subscribe({
        next: (response: any) => {
          if (response.status && response.data) {
            this.examList.set(response.data.list);
            this.totalExams.set(response.data.num);
          }
          this.loading.set(false);
        },
        error: (error: any) => {
          console.error('Error loading exams:', error);
          this.loading.set(false);
          this.examList.set([]);
        },
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadExams();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadExams();
  }

  onSearch(): void {
    // Implement search logic here
    console.log('Searching for:', this.searchTerm);
    // For now, just reload exams
    this.loadExams();
  }

  startExam(exam: Exam): void {
    console.log('Starting exam:', exam);
    // Navigate to exam taking page
    // this.router.navigate(['/exam', exam.id]);
  }

  viewDetails(exam: Exam): void {
    console.log('Viewing details for exam:', exam);
    // Navigate to exam details page
    // this.router.navigate(['/exam-details', exam.id]);
  }

  trackByExamId(index: number, exam: Exam): number {
    return exam.id;
  }

  navigateToReading(exam: any ): void {
    this.router.navigate(['/student/exam', exam]);
  }
}
