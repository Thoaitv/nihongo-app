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
  selector: 'app-tu-vung',
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
  templateUrl: './tu-vung.component.html',
  styleUrls: ['./tu-vung.component.scss'],
})
export class TuVungComponent implements OnInit {
  constructor() {}
  vocabForm!: FormGroup;
  isModalVisible = false;
  isLoading = false;
  modalTitle = 'Thêm từ vựng mới';
  searchValue = '';

  vocabularies: any[] = [];
  topics: any[] = [];
  totalItems = 0;
  pageIndex = 1;
  pageSize = 10;

  fileToUpload: File | null = null;
  fileError = false;

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private message = inject(NzMessageService);

  ngOnInit(): void {
    this.initForm();
    this.loadVocabularies();
    this.loadTopics();
  }

  initForm(): void {
    this.vocabForm = this.fb.group({
      japaneseWord: ['', Validators.required],
      romaji: ['', Validators.required],
      exampleSentence: ['', Validators.required],
      description: [''], // ✅ mới thêm
      linkAudio: [''], // ✅ mới thêm
      topicId: [null, Validators.required],
    });
  }

  loadVocabularies(): void {
    this.isLoading = true;
    this.apiService.listVocabularies(this.pageIndex, this.pageSize).subscribe({
      next: (res: any) => {
        this.vocabularies = res.data?.list || [];
        this.totalItems = res.data?.num || 0;
      },
      error: (err) => {
        this.message.error('Lỗi khi tải danh sách từ vựng.');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  loadTopics(): void {
    this.apiService.listTopics().subscribe({
      next: (res: any) => {
        this.topics = res.data?.list || [];
      },
      error: () => {
        this.message.error('Lỗi khi tải danh sách chủ đề.');
      },
    });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadVocabularies();
  }

  onSearch(): void {
    // Optionally implement search logic here
  }

  showAddModal(): void {
    this.modalTitle = 'Thêm từ vựng mới';
    this.vocabForm.reset();
    this.fileToUpload = null;
    this.fileError = false;
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.vocabForm.reset();
    this.fileToUpload = null;
    this.fileError = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
      this.fileError = false;
    }
  }

  handleSubmit(): void {
    if (this.vocabForm.invalid || !this.fileToUpload) {
      if (!this.fileToUpload) this.fileError = true;
      this.vocabForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('japaneseWord', this.vocabForm.value.japaneseWord);
    formData.append('romaji', this.vocabForm.value.romaji);
    formData.append('exampleSentence ', this.vocabForm.value.exampleSentence);
    formData.append('topicId', this.vocabForm.value.topicId);
    formData.append('description', this.vocabForm.value.description); // ✅ thêm
    formData.append('linkAudio', this.vocabForm.value.linkAudio); // ✅ thêm
    formData.append('file', this.fileToUpload!);

    this.apiService.createVocabulary(formData).subscribe({
      next: () => {
        this.message.success('Thêm từ vựng thành công!');
        this.loadVocabularies();
        this.handleCancel();
      },
      error: () => {
        this.message.error('Thêm từ vựng thất bại!');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
