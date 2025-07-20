import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ActivatedRoute } from '@angular/router';

interface QuestionChoice {
  id: number;
  choiceText: string;
  selectChoiceCode: string;
  correct: boolean;
}

interface Question {
  id: number;
  questionText: string;
  explanation: string;
  questionChoiceResponseDtos: QuestionChoice[];
}

interface Lesson {
  id: number;
  title: string;
  content: string | null;
  jomaji: string;
  audioLink: string | null;
  fileId: number | null;
  lessonType: 'LISTENING' | 'READING';
  questionResponseDtos: Question[];
}

interface ExamData {
  id: number;
  title: string;
  description: string;
  lessonsResponseDtos: Lesson[];
  examQuestionResponseDtos: Question[];
}

interface ExamAnswer {
  questionId: number;
  selectOption: string;
}

interface SubmitRequest {
  examId: number;
  userId: number;
  startTime: string;
  endTime: string;
  examAttemptAnswers: ExamAnswer[];
}

interface SubmitResponse {
  status: boolean;
  message: string;
  httpCode: number;
  data: {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
  };
  errorCode: string;
}
@Component({
  selector: 'app-exam-detail',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NzCardModule,
    NzRadioModule,
    NzButtonModule,
    NzDividerModule,
    NzTagModule,
    NzProgressModule,
    NzSpinModule,
    NzTypographyModule,
    NzGridModule,
  ],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.scss',
  providers: [NzModalService], // ⚠️ PHẢI có nếu dùng inject()
})
export class ExamDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  examData: any | null = null;
  answers = new Map<string, string>(); // key: type_lessonId_questionId, value: selectedChoice
  loading = false;
  submitting = false;
  startTime = new Date();
  elapsedTime = 0;
  timer?: any;

  examId = 6; // Set your exam ID here or get from route params

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      const id = params['id'];
      if (id) {
        this.loadExamData(id);
      }
    });
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private loadExamData(id: any) {
    this.loading = true;
    this.http
      .get<any>(
        `http://localhost:9093/exam/${id}/questions?includeAnswers=false`
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.status && response.data) {
            this.examData = response.data;
          } else {
            this.message.error('Không thể tải dữ liệu bài thi!');
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Load exam error:', error);
          this.message.error('Có lỗi xảy ra khi tải bài thi!');
        },
      });
  }

  private startTimer() {
    this.timer = setInterval(() => {
      this.elapsedTime = Math.floor(
        (new Date().getTime() - this.startTime.getTime()) / 1000
      );
    }, 1000);
  }

  get listeningLessons(): Lesson[] {
    return (
      this.examData?.lessonsResponseDtos?.filter(
        (lesson: any) => lesson.lessonType === 'LISTENING'
      ) || []
    );
  }

  get readingLessons(): Lesson[] {
    return (
      this.examData?.lessonsResponseDtos?.filter(
        (lesson: any) => lesson.lessonType === 'READING'
      ) || []
    );
  }

  get totalQuestions(): number {
    let total = 0;
    if (this.examData) {
      // Count lesson questions
      this.examData.lessonsResponseDtos?.forEach((lesson: any) => {
        total += lesson.questionResponseDtos?.length || 0;
      });
      // Count exam questions
      total += this.examData.examQuestionResponseDtos?.length || 0;
    }
    return total;
  }

  get answeredCount(): number {
    return this.answers.size;
  }

  get progressPercent(): number {
    return this.totalQuestions > 0
      ? Math.round((this.answeredCount / this.totalQuestions) * 100)
      : 0;
  }

  private getAnswerKey(
    type: 'lesson' | 'exam',
    lessonId: number,
    questionId: number
  ): string {
    return `${type}_${lessonId}_${questionId}`;
  }

  getAnswer(
    type: 'lesson' | 'exam',
    lessonId: number,
    questionId: number
  ): string | null {
    return (
      this.answers.get(this.getAnswerKey(type, lessonId, questionId)) || null
    );
  }

  setAnswer(
    type: 'lesson' | 'exam',
    lessonId: number,
    questionId: number,
    selectedChoice: string
  ) {
    this.answers.set(
      this.getAnswerKey(type, lessonId, questionId),
      selectedChoice
    );
  }

  isQuestionAnswered(
    type: 'lesson' | 'exam',
    lessonId: number,
    questionId: number
  ): boolean {
    return this.answers.has(this.getAnswerKey(type, lessonId, questionId));
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  submitExam() {
    if (this.answeredCount < this.totalQuestions) {
      this.modal.confirm({
        nzTitle: 'Xác nhận nộp bài',
        nzContent: `Bạn chưa trả lời hết tất cả câu hỏi (${this.answeredCount}/${this.totalQuestions}). Bạn có chắc chắn muốn nộp bài không?`,
        nzOkText: 'Nộp bài',
        nzCancelText: 'Tiếp tục làm',
        nzOnOk: () => this.performSubmit(),
      });
    } else {
      this.performSubmit();
    }
  }

  private performSubmit() {
    if (!this.examData) return;

    this.submitting = true;
    const endTime = new Date();

    // Prepare exam answers
    const examAttemptAnswers: ExamAnswer[] = [];

    // Add lesson answers
    this.examData.lessonsResponseDtos?.forEach((lesson: any) => {
      lesson.questionResponseDtos?.forEach((question: any) => {
        const answer = this.getAnswer('lesson', lesson.id, question.id);
        if (answer) {
          examAttemptAnswers.push({
            questionId: question.id,
            selectOption: answer,
          });
        }
      });
    });

    // Add exam question answers
    this.examData.examQuestionResponseDtos?.forEach((question: any) => {
      const answer = this.getAnswer('exam', 0, question.id);
      if (answer) {
        examAttemptAnswers.push({
          questionId: question.id,
          selectOption: answer,
        });
      }
    });

    const submitData: SubmitRequest = {
      examId: this.examData.id,
      userId: parseInt(localStorage.getItem('userId') || '1'), // Get from localStorage
      startTime: this.startTime.toISOString(),
      endTime: endTime.toISOString(),
      examAttemptAnswers,
    };

    // API call
    this.http
      .post<any>(
        `http://localhost:9093/exam/${this.examData.id}/submit`,
        submitData
      )
      .subscribe({
        next: (response) => {
          this.submitting = false;
          if (response.status) {
            this.showResult(response.data);
          } else {
            this.message.error('Có lỗi xảy ra khi nộp bài!');
          }
        },
        error: (error) => {
          this.submitting = false;
          console.error('Submit error:', error);
          this.message.error('Có lỗi xảy ra khi nộp bài!');
        },
      });
  }

  private showResult(result: any) {
    this.modal.success({
      nzTitle: 'Kết quả bài thi',
      nzOkText: 'Nộp bài',
      nzContent: `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 48px; color: #52c41a; margin-bottom: 16px;">
            <i class="fas fa-trophy"></i>
          </div>
          <h3>Điểm số: ${result.score}/100</h3>
          <p>Số câu đúng: ${result.correctAnswers}/${result.totalQuestions}</p>
          <p>Tỷ lệ: ${Math.round(
            (result.correctAnswers / result.totalQuestions) * 100
          )}%</p>
        </div>
      `,
      nzWidth: 500,
    });

    // Stop timer
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
