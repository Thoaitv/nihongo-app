import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ApiService } from '../../services/api.service';
// exam.model.ts
export interface ExamChoice {
  id?: number;
  choiceText: string;
  selectChoiceCode: string;
  correct: boolean;
}

export interface ExamQuestion {
  id?: number;
  questionText: string;
  explanation: string;
  questionChoicesRequestDtos: ExamChoice[];
}

export interface Exam {
  id?: number;
  title: string;
  description: string;
  readingIds: number[];
  listeningIds: number[];
  examQuestionRequestDtos: ExamQuestion[];
}

export interface ExamListItem {
  id: number;
  title: string;
  description: string;
}

export interface ExamListResponse {
  data: {
    list: ExamListItem[];
    num: number;
    totalPage: number;
    currentPage: number;
  };
}

@Component({
  selector: 'app-exam-admin',
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
    NzPaginationModule,
    NzCardModule,
    NzDividerModule,
    NzSwitchModule,
    NzIconModule,
    NzPopconfirmModule,
  ],
  templateUrl: './exam-admin.component.html',
  styleUrl: './exam-admin.component.scss',
})
export class ExamAdminComponent implements OnInit {
  exams: ExamListItem[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  total = 0;

  // Modal states
  isModalVisible = false;
  modalTitle = '';
  modalMode: 'create' | 'edit' | 'view' = 'create';
  currentExamId?: number;

  // Form
  examForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.examForm = this.initForm();
  }

  ngOnInit(): void {
    this.loadExams();
  }

  initForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      readingIds: [[]],
      listeningIds: [[]],
      examQuestionRequestDtos: this.fb.array([]),
    });
  }

  get questionsFormArray(): FormArray {
    return this.examForm.get('examQuestionRequestDtos') as FormArray;
  }

  getChoicesFormArray(questionIndex: number): FormArray {
    return this.questionsFormArray
      .at(questionIndex)
      .get('questionChoicesRequestDtos') as FormArray;
  }

  loadExams(): void {
    this.loading = true;
    this.apiService.getExams(this.pageSize, this.currentPage).subscribe({
      next: (response: any) => {
        this.exams = response.data.list;
        this.total = response.data.num;
        this.loading = false;
      },
      error: () => {
        this.message.error('Lỗi khi tải danh sách bài thi');
        this.loading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadExams();
  }

  showCreateModal(): void {
    this.modalMode = 'create';
    this.modalTitle = 'Tạo bài thi mới';
    this.examForm = this.initForm();
    this.addQuestion();
    this.isModalVisible = true;
  }

  showViewModal(exam: ExamListItem): void {
    this.modalMode = 'view';
    this.modalTitle = 'Xem chi tiết bài thi';
    this.currentExamId = exam.id;
    this.loadExamDetail(exam.id);
    this.isModalVisible = true;
  }

  showEditModal(exam: ExamListItem): void {
    this.modalMode = 'edit';
    this.modalTitle = 'Chỉnh sửa bài thi';
    this.currentExamId = exam.id;
    this.loadExamDetail(exam.id);
    this.isModalVisible = true;
  }

  loadExamDetail(id: number): void {
    this.apiService.getExamDetail(id).subscribe({
      next: (response: any) => {
        this.populateForm(response.data);
      },
      error: () => {
        this.message.error('Lỗi khi tải chi tiết bài thi');
      },
    });
  }

  populateForm(examData: any): void {
    this.examForm.patchValue({
      title: examData?.title,
      description: examData?.description,
      readingIds: [],
      listeningIds: [],
    });

    // Clear existing questions
    while (this.questionsFormArray.length !== 0) {
      this.questionsFormArray.removeAt(0);
    }

    // Add questions from exam
    examData?.examQuestionResponseDtos.forEach((question: any) => {
      const questionGroup = this.createQuestionGroup();
      questionGroup.patchValue({
        id: question.id,
        questionText: question.questionText,
        explanation: question.explanation,
      });

      // Clear default choices
      const choicesArray = questionGroup.get(
        'questionChoicesRequestDtos'
      ) as FormArray;
      while (choicesArray.length !== 0) {
        choicesArray.removeAt(0);
      }

      // Add choices from response
      question.questionChoiceResponseDtos.forEach((choice: any) => {
        const choiceGroup = this.createChoiceGroup();
        choiceGroup.patchValue({
          id: choice.id,
          choiceText: choice.choiceText,
          selectChoiceCode: choice.selectChoiceCode,
          correct: choice.correct,
        });
        choicesArray.push(choiceGroup);
      });

      this.questionsFormArray.push(questionGroup);
    });
  }

  createQuestionGroup(): FormGroup {
    const group = this.fb.group({
      id: [0],
      questionText: ['', [Validators.required]],
      explanation: ['', [Validators.required]],
      questionChoicesRequestDtos: this.fb.array([]),
    });

    // Add default choices
    const choicesArray = group.get('questionChoicesRequestDtos') as FormArray;
    for (let i = 0; i < 4; i++) {
      choicesArray.push(this.createChoiceGroup());
    }

    return group;
  }

  createChoiceGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      choiceText: ['', [Validators.required]],
      selectChoiceCode: ['A'],
      correct: [false],
    });
  }

  addQuestion(): void {
    this.questionsFormArray.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    this.questionsFormArray.removeAt(index);
  }

  addChoice(questionIndex: number): void {
    const choicesArray = this.getChoicesFormArray(questionIndex);
    choicesArray.push(this.createChoiceGroup());
  }

  removeChoice(questionIndex: number, choiceIndex: number): void {
    const choicesArray = this.getChoicesFormArray(questionIndex);
    choicesArray.removeAt(choiceIndex);
  }

  onCorrectChoiceChange(
    questionIndex: number,
    choiceIndex: number,
    isCorrect: boolean
  ): void {
    if (isCorrect) {
      // Set all other choices to false
      const choicesArray = this.getChoicesFormArray(questionIndex);
      for (let i = 0; i < choicesArray.length; i++) {
        if (i !== choiceIndex) {
          choicesArray.at(i).get('correct')?.setValue(false);
        }
      }
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.examForm.reset();
  }

  handleOk(): void {
    if (this.modalMode === 'view') {
      this.isModalVisible = false;
      return;
    }

    if (this.examForm.valid) {
      const formValue = this.examForm.value;

      if (this.modalMode === 'create') {
        this.apiService.createExam(formValue).subscribe({
          next: () => {
            this.message.success('Tạo bài thi thành công');
            this.isModalVisible = false;
            this.loadExams();
          },
          error: () => {
            this.message.error('Lỗi khi tạo bài thi');
          },
        });
      } else if (this.modalMode === 'edit' && this.currentExamId) {
        this.apiService.updateExam(this.currentExamId, formValue).subscribe({
          next: () => {
            this.message.success('Cập nhật bài thi thành công');
            this.isModalVisible = false;
            this.loadExams();
          },
          error: () => {
            this.message.error('Lỗi khi cập nhật bài thi');
          },
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.examForm.controls).forEach((key) => {
      const control = this.examForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((group) => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach((subKey) => {
              const subControl = group.get(subKey);
              subControl?.markAsTouched();

              if (subControl instanceof FormArray) {
                subControl.controls.forEach((subGroup) => {
                  if (subGroup instanceof FormGroup) {
                    Object.keys(subGroup.controls).forEach((subSubKey) => {
                      subGroup.get(subSubKey)?.markAsTouched();
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  get isReadonly(): boolean {
    return this.modalMode === 'view';
  }
}
