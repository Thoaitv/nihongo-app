import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ApiService } from '../../services/api.service';

interface Topic {
  id: number;
  name: string;
  description: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  status: 'active' | 'inactive';
  lessonsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzTagModule,
    NzSpaceModule,
    NzCardModule,
    NzDividerModule,
    NzSelectModule,
    NzIconModule,
    NzToolTipModule,
  ],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];
  isModalVisible = false;
  isLoading = false;
  modalTitle = '';
  topicForm!: FormGroup;
  editingTopic: Topic | null = null;
  searchValue = '';
  filteredTopics: Topic[] = [];

  protected apiService = inject(ApiService);

  levelOptions = [
    { label: 'N5', value: 'N5' },
    { label: 'N4', value: 'N4' },
    { label: 'N3', value: 'N3' },
    { label: 'N2', value: 'N2' },
    { label: 'N1', value: 'N1' },
  ];

  statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
  ];

  // Fixed pagination properties
  pageIndex = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private fb: FormBuilder, private message: NzMessageService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTopics();
  }

  initForm() {
    this.topicForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      level: ['N5', [Validators.required]],
      status: ['active', [Validators.required]],
    });
  }

  // Fixed loadTopics method
  loadTopics(
    page: number = this.pageIndex,
    limit: number = this.pageSize
  ): void {
    this.isLoading = true;

    this.apiService.listTopics(page, limit).subscribe({
      next: (res: any) => {
        if (res.status && res.data?.list) {
          this.topics = res.data.list.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            level: item.level || 'N5',
            status: item.status || 'active',
            lessonsCount: item.lessonsCount || 0,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }));
          this.totalItems = res.data.num || 0;
          // Don't filter here if using server-side pagination
          this.filteredTopics = [...this.topics];
        } else {
          this.topics = [];
          this.filteredTopics = [];
          this.totalItems = 0;
        }
      },
      error: (err) => {
        console.error('Failed to load topics:', err);
        this.topics = [];
        this.filteredTopics = [];
        this.totalItems = 0;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.topicForm.reset();
    this.editingTopic = null;
  }

  handleSubmit(): void {
    if (this.topicForm.valid) {
      this.isLoading = true;
      const formData = this.topicForm.value;

      if (this.editingTopic) {
        // Update existing topic
        this.apiService
          .updateTopic(this.editingTopic.id, {
            name: formData.name,
            description: formData.description,
          })
          .subscribe({
            next: (response) => {
              this.message.success('Cập nhật chủ đề thành công!');
              // Stay on current page after update
              this.loadTopics(this.pageIndex, this.pageSize);
              this.handleCancel();
            },
            error: (error) => {
              console.error('Update topic error:', error);
              this.message.error('Có lỗi xảy ra khi cập nhật chủ đề!');
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      } else {
        // Add new topic
        this.apiService
          .createTopic({
            name: formData.name,
            code: this.generateUUID(),
            description: formData.description,
          })
          .subscribe({
            next: (response) => {
              this.message.success('Thêm chủ đề mới thành công!');
              // Go to first page after adding new item
              this.pageIndex = 1;
              this.loadTopics(this.pageIndex, this.pageSize);
              this.handleCancel();
            },
            error: (error) => {
              console.error('Create topic error:', error);
              this.message.error('Có lỗi xảy ra khi thêm chủ đề mới!');
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      }
    } else {
      // Mark invalid fields as dirty
      Object.values(this.topicForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteTopic(id: number): void {
    this.isLoading = true;

    this.apiService.deleteTopic(id).subscribe({
      next: (response) => {
        this.message.success('Xóa chủ đề thành công!');

        // Calculate if we need to go to previous page
        const currentPageFirstItem = (this.pageIndex - 1) * this.pageSize + 1;
        const willBeEmpty =
          this.filteredTopics.length === 1 && this.pageIndex > 1;

        if (willBeEmpty) {
          this.pageIndex = this.pageIndex - 1;
        }

        this.loadTopics(this.pageIndex, this.pageSize);
      },
      error: (error) => {
        console.error('Delete topic error:', error);
        this.message.error('Có lỗi xảy ra khi xóa chủ đề!');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  showEditModal(topic: any): void {
    this.modalTitle = 'Sửa chủ đề';
    this.editingTopic = topic;
    this.topicForm.patchValue({
      name: topic.name,
      description: topic.description,
      level: topic.level,
      status: topic.status,
    });
    this.isModalVisible = true;
  }

  showAddModal(): void {
    this.modalTitle = 'Thêm chủ đề mới';
    this.editingTopic = null;
    this.topicForm.reset();
    this.topicForm.patchValue({
      level: 'N5',
      status: 'active',
    });
    this.isModalVisible = true;
  }

  onSearch(): void {
    // Reset to first page when searching
    this.pageIndex = 1;
    this.filterTopics();
  }

  filterTopics(): void {
    if (!this.searchValue.trim()) {
      this.filteredTopics = [...this.topics];
    } else {
      this.filteredTopics = this.topics.filter(
        (topic) =>
          topic.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          topic.description
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
      );
    }
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      N5: 'green',
      N4: 'blue',
      N3: 'orange',
      N2: 'red',
      N1: 'purple',
    };
    return colors[level] || 'default';
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'success' : 'default';
  }

  getStatusText(status: string): string {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
  }

  // Fixed pagination handler
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadTopics(page, this.pageSize);
  }

  // Optional: Add page size change handler
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1; // Reset to first page
    this.loadTopics(this.pageIndex, this.pageSize);
  }
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
