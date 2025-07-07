// topic-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    NzSelectModule
  ],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];
  isModalVisible = false;
  isLoading = false;
  modalTitle = '';
  topicForm: FormGroup;
  editingTopic: Topic | null = null;
  searchValue = '';
  filteredTopics: Topic[] = [];

  levelOptions = [
    { label: 'N5', value: 'N5' },
    { label: 'N4', value: 'N4' },
    { label: 'N3', value: 'N3' },
    { label: 'N2', value: 'N2' },
    { label: 'N1', value: 'N1' }
  ];

  statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.topicForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      level: ['N5', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.topics = [
        {
          id: 1,
          name: 'Hiragana cơ bản',
          description: 'Học các ký tự Hiragana cơ bản từ あ đến ん',
          level: 'N5',
          status: 'active',
          lessonsCount: 15,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: 2,
          name: 'Katakana cơ bản',
          description: 'Học các ký tự Katakana cơ bản từ ア đến ン',
          level: 'N5',
          status: 'active',
          lessonsCount: 12,
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-25')
        },
        {
          id: 3,
          name: 'Kanji N4',
          description: 'Học các ký tự Kanji cho cấp độ N4',
          level: 'N4',
          status: 'active',
          lessonsCount: 25,
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-10')
        },
        {
          id: 4,
          name: 'Ngữ pháp N3',
          description: 'Các cấu trúc ngữ pháp cơ bản cho cấp độ N3',
          level: 'N3',
          status: 'inactive',
          lessonsCount: 8,
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-02-20')
        }
      ];
      this.filteredTopics = [...this.topics];
      this.isLoading = false;
    }, 1000);
  }

  showAddModal(): void {
    this.modalTitle = 'Thêm chủ đề mới';
    this.editingTopic = null;
    this.topicForm.reset();
    this.topicForm.patchValue({
      level: 'N5',
      status: 'active'
    });
    this.isModalVisible = true;
  }

  showEditModal(topic: Topic): void {
    this.modalTitle = 'Sửa chủ đề';
    this.editingTopic = topic;
    this.topicForm.patchValue({
      name: topic.name,
      description: topic.description,
      level: topic.level,
      status: topic.status
    });
    this.isModalVisible = true;
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
      
      // Simulate API call
      setTimeout(() => {
        if (this.editingTopic) {
          // Update existing topic
          const index = this.topics.findIndex(t => t.id === this.editingTopic!.id);
          if (index !== -1) {
            this.topics[index] = {
              ...this.topics[index],
              ...formData,
              updatedAt: new Date()
            };
            this.message.success('Cập nhật chủ đề thành công!');
          }
        } else {
          // Add new topic
          const newTopic: Topic = {
            id: Math.max(...this.topics.map(t => t.id)) + 1,
            ...formData,
            lessonsCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          this.topics.unshift(newTopic);
          this.message.success('Thêm chủ đề mới thành công!');
        }
        
        this.filterTopics();
        this.isModalVisible = false;
        this.topicForm.reset();
        this.editingTopic = null;
        this.isLoading = false;
      }, 1000);
    } else {
      Object.values(this.topicForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteTopic(id: number): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.topics = this.topics.filter(topic => topic.id !== id);
      this.filterTopics();
      this.message.success('Xóa chủ đề thành công!');
      this.isLoading = false;
    }, 500);
  }

  onSearch(): void {
    this.filterTopics();
  }

  filterTopics(): void {
    if (!this.searchValue.trim()) {
      this.filteredTopics = [...this.topics];
    } else {
      this.filteredTopics = this.topics.filter(topic =>
        topic.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        topic.description.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      'N5': 'green',
      'N4': 'blue',
      'N3': 'orange',
      'N2': 'red',
      'N1': 'purple'
    };
    return colors[level] || 'default';
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'success' : 'default';
  }

  getStatusText(status: string): string {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
  }
}