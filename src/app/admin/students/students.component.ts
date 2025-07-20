import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-students',
  imports: [CommonModule, NzTableModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  private apiService = inject(ApiService);
  users: any[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 1;
  isLoading = false;
  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = this.pageIndex) {
    this.isLoading = true;

    this.apiService.getUsers(this.pageSize, page).subscribe({
      next: (res: any) => {
        this.users = res.data.list;
        this.totalItems = res.data.num * res.data.totalPage;
        this.pageIndex = res.data.currentPage;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadUsers(page);
  }
}
