import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { environment } from '../../../../environments/environment';

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
  selectedAnswer?: string;
  isAnswered?: boolean;
  isCorrect?: boolean;
}

interface ReadingData {
  id: number;
  title: string;
  content: string | null;
  jomaji: string;
  audioLink: string | null;
  questionResponseDtos: Question[];
}

@Component({
  selector: 'app-reading-exam',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzRadioModule,
    NzDividerModule,
    NzTagModule,
    NzAlertModule,
    NzProgressModule,
    NzTypographyModule,
    NzSpaceModule,
    NzResultModule,
    NzSpinModule,
  ],
  templateUrl: './reading-detail.component.html',
  styleUrl: './reading-detail.component.scss',
})
export class ReadingDetailComponent implements OnInit {
 readingData: ReadingData | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  get totalQuestions(): number {
    return this.readingData?.questionResponseDtos?.length || 0;
  }

  get answeredCount(): number {
    return this.readingData?.questionResponseDtos?.filter((q) => q.isAnswered)?.length || 0;
  }

  get progressPercent(): number {
    if (this.totalQuestions === 0) return 0;
    return Math.round((this.answeredCount / this.totalQuestions) * 100);
  }

  get correctCount(): number {
    return this.readingData?.questionResponseDtos?.filter((q) => q.isCorrect)?.length || 0;
  }

  get isCompleted(): boolean {
    return this.answeredCount === this.totalQuestions;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const readingId = params['id'];
      if (readingId) {
        this.loadReadingData(readingId);
      }
    });
  }

  loadReadingData(readingId: string): void {
    this.loading = true;
    this.error = null;
    
    const apiUrl = `${environment}/reading/${readingId}/answer`;
    
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.readingData = response.data;
        } else {
          this.error = response.message || 'Không thể tải dữ liệu bài đọc.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reading data:', error);
        this.error = 'Không thể tải dữ liệu bài đọc. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  submitAnswer(question: Question): void {
    if (!question.selectedAnswer) return;

    const selectedChoice = question.questionChoiceResponseDtos.find(
      (choice) => choice.selectChoiceCode === question.selectedAnswer
    );

    question.isAnswered = true;
    question.isCorrect = selectedChoice?.correct || false;
  }

  getResultStatus(): any {
    const percentage = (this.correctCount / this.totalQuestions) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  }

  getResultTitle(): string {
    const percentage = (this.correctCount / this.totalQuestions) * 100;
    if (percentage >= 80) return 'Xuất sắc!';
    if (percentage >= 60) return 'Khá tốt!';
    return 'Cần cố gắng thêm!';
  }

  getResultSubtitle(): string {
    return `Bạn đã trả lời đúng ${this.correctCount}/${
      this.totalQuestions
    } câu (${Math.round((this.correctCount / this.totalQuestions) * 100)}%)`;
  }

  retryLoad(): void {
    this.route.params.subscribe(params => {
      const readingId = params['id'];
      if (readingId) {
        this.loadReadingData(readingId);
      }
    });
  }
}