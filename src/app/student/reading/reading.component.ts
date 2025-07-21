import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, startWith, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ReadingItem {
  id: number;
  title: string;
  lessonType: string;
}

interface ReadingListResponse {
  status: boolean;
  message: string;
  httpCode: number;
  data: {
    list: ReadingItem[];
    num: number;
    totalPage: number;
    currentPage: number;
  };
  errorCode: string;
}
@Component({
  selector: 'app-reading',
  imports: [CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzTagModule,
    NzSpinModule,
    NzPaginationModule,
    NzEmptyModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule],
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.scss'
})
export class ReadingComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly searchSubject = new BehaviorSubject<string>('');
  
  // Data properties
  readingList: ReadingItem[] = [];
  totalReadings = 0;
  totalPages = 1;
  currentPage = 1;
  pageSize = 10;
  loading = false;
  
  // Filter properties
  searchTerm = '';
  sortBy = 'newest';
  

  ngOnInit(): void {
    this.setupSearch();
    this.loadReadings();
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchReadings(term))
    ).subscribe();
  }

  loadReadings(): void {
    this.loading = true;
    const url = `${environment.apiUrl}/readings?limit=${this.pageSize}&page=${this.currentPage}`;
    
    this.http.get<ReadingListResponse>(url).pipe(
      catchError(error => {
        console.error('Error loading readings:', error);
        return of({
          status: false,
          message: 'Error',
          httpCode: 500,
          data: { list: [], num: 0, totalPage: 0, currentPage: 1 },
          errorCode: 'error'
        });
      })
    ).subscribe(response => {
      this.loading = false;
      if (response.status && response.data) {
        this.readingList = response.data.list;
        this.totalReadings = response.data.num;
        this.totalPages = response.data.totalPage;
        this.currentPage = response.data.currentPage;
      }
    });
  }

  private searchReadings(term: string): Observable<any> {
    // In a real app, you would implement search on the backend
    // For now, we'll just reload the readings
    this.loadReadings();
    return of(null);
  }

  navigateToReading(readingId: number): void {
    this.router.navigate(['/student/reading', readingId]);
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm);
  }

  onSortChange(): void {
    // In a real app, you would implement sorting on the backend
    this.loadReadings();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReadings();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadReadings();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.loadReadings();
  }

  getLessonTypeLabel(type: string): string {
    switch (type) {
      case 'READING':
        return 'Bài đọc';
      case 'LISTENING':
        return 'Nghe hiểu';
      case 'VOCABULARY':
        return 'Từ vựng';
      default:
        return type;
    }
  }
}