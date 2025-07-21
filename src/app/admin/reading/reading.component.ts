import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'; // Add this import
import { environment } from '../../../environments/environment';

interface ListeningItem {
  id: number;
  title: string;
  lessonType: string;
}

interface ListeningDetail {
  id: number;
  title: string;
  content: string | null;
  jomaji: string;
  audioLink: string | null;
  fileId: number | null;
  lessonType: string;
  questionResponseDtos: Question[];
}

interface Question {
  id: number;
  questionText: string;
  explanation: string;
  questionChoiceResponseDtos: Choice[];
}

interface Choice {
  id: number;
  choiceText: string;
  selectChoiceCode: string;
  correct: boolean;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  httpCode: number;
  data: T;
  errorCode: string;
}

interface ListResponse {
  list: ListeningItem[];
  num: number;
  totalPage: number;
  currentPage: number;
}

@Component({
  selector: 'app-reading-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule,
    NzPaginationModule,
    NzCardModule,
    NzDividerModule,
    NzSpaceModule,
    NzTagModule,
    NzCollapseModule,
    NzCheckboxModule, // Add this to imports array
  ],
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.scss',
})
export class ReadingAdminComponent implements OnInit {
  listeningList: ListeningItem[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  isCreateModalVisible = false;
  isDetailModalVisible = false;
  createForm: FormGroup;
  selectedListening: ListeningDetail | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.createForm = this.createFormGroup();
  }

  ngOnInit() {
    this.loadListeningList();
    // Initialize with one question when component loads
    if (this.questionsArray.length === 0) {
      this.addQuestion();
    }
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      content: [''],
      jomaji: [''],
      lessonType: ['READING'],
      questionRequestDtos: this.fb.array([]),
    });
  }

  get questionsArray(): FormArray {
    return this.createForm.get('questionRequestDtos') as FormArray;
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      questionText: ['', [Validators.required]],
      explanation: [''],
      questionChoicesRequestDtos: this.fb.array([
        this.createChoiceGroup('A'),
        this.createChoiceGroup('B'),
        this.createChoiceGroup('C'),
        this.createChoiceGroup('D'),
      ]),
    });
  }

  createChoiceGroup(code: string): FormGroup {
    return this.fb.group({
      id: [0],
      choiceText: ['', [Validators.required]],
      selectChoiceCode: [code],
      correct: [false],
    });
  }

  getChoicesArray(questionIndex: number): FormArray {
    return this.questionsArray
      .at(questionIndex)
      .get('questionChoicesRequestDtos') as FormArray;
  }

  loadListeningList() {
    this.loading = true;
    this.http
      .get<ApiResponse<ListResponse>>(
        `${environment.apiUrl}/readings?limit=${this.pageSize}&page=${this.pageIndex}`
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.listeningList = response.data.list;
            this.total = response.data.num;
            this.pageIndex = response.data.currentPage;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading listening list:', error);
          this.message.error('Không thể tải danh sách bài nghe');
          this.loading = false;
        },
      });
  }

  onPageChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadListeningList();
  }

  showCreateModal() {
    this.createForm = this.createFormGroup(); // Recreate form instead of reset
    this.isCreateModalVisible = true;
    this.addQuestion();
  }

  addQuestion() {
    const questionGroup = this.createQuestionGroup();
    this.questionsArray.push(questionGroup);
  }

  removeQuestion(index: number) {
    if (this.questionsArray.length > 1) {
      this.questionsArray.removeAt(index);
    }
  }

  handleCreateOk() {
    if (this.createForm.valid) {
      const formData = this.createForm.value;
      formData.id = 0;

      this.http
        .post<ApiResponse<any>>(`${environment.apiUrl}/reading`, formData)
        .subscribe({
          next: (response) => {
            if (response.status) {
              this.message.success('Tạo bài nghe thành công');
              this.isCreateModalVisible = false;
              this.loadListeningList();
            } else {
              this.message.error('Tạo bài nghe thất bại');
            }
          },
          error: (error) => {
            console.error('Error creating listening:', error);
            this.message.error('Có lỗi xảy ra khi tạo bài nghe');
          },
        });
    } else {
      this.markFormGroupTouched(this.createForm);
    }
  }

  handleCreateCancel() {
    this.isCreateModalVisible = false;
  }

  viewDetail(id: number) {
    this.http
      .get<ApiResponse<ListeningDetail>>(
        `${environment.apiUrl}/reading/${id}`
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.selectedListening = response.data;
            this.isDetailModalVisible = true;
          }
        },
        error: (error) => {
          console.error('Error loading listening detail:', error);
          this.message.error('Không thể tải chi tiết bài nghe');
        },
      });
  }

  handleDetailCancel() {
    this.isDetailModalVisible = false;
    this.selectedListening = null;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
