import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { HttpClient } from '@angular/common/http';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { environment } from '../../../../environments/environment';
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

interface ListeningData {
  id: number;
  title: string;
  content: string | null;
  jomaji: string;
  audioLink: string | null;
  fileId: string | null;
  lessonType: string;
  questionResponseDtos: Question[];
}

interface UserAnswer {
  questionId: number;
  selectedChoiceId: number;
  selectedChoiceCode: string;
}
@Component({
  selector: 'app-listening-detail',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzRadioModule,
    NzButtonModule,
    NzMessageModule,
    NzDividerModule,
    NzAlertModule,
    NzTypographyModule,
    NzSpaceModule,
    NzSpinModule,
  ],
  templateUrl: './listening-detail.component.html',
  styleUrl: './listening-detail.component.scss',
})
export class ListeningDetailComponent implements OnInit {
  listeningData: ListeningData | null = null;
  userAnswers: UserAnswer[] = [];
  isSubmitted = false;
  loading = false;
  error: any | null = null;
  isPlayingAudio: number | null = null;
  private route = inject(ActivatedRoute);

  constructor(private message: NzMessageService, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const vocal = params['id'];
      if (vocal) {
        this.loadListeningData(vocal); // ID mặc định là 3, có thể thay đổi hoặc nhận từ route params
      }
    });
  }
  getLessonTypeLabel(lessonType: string | undefined): string {
    switch (lessonType) {
      case 'LISTENING':
        return 'Bài nghe';
      case 'READING':
        return 'Bài đọc';
      case 'GRAMMAR':
        return 'Ngữ pháp';
      case 'VOCABULARY':
        return 'Từ vựng';
      default:
        return 'Bài học';
    }
  }

  retryLoad() {
    this.loadListeningData(3); // Retry với cùng lesson ID
  }

  // playAudio() {
  //   const audioElement = document.querySelector('audio') as HTMLAudioElement;
  //   if (audioElement) {
  //     if (audioElement.paused) {
  //       audioElement.play();
  //       this.message.info('Đang phát audio...');
  //     } else {
  //       audioElement.pause();
  //       this.message.info('Đã tạm dừng audio');
  //     }
  //   } else {
  //     this.message.warning('Không tìm thấy file audio');
  //   }
  // }

  playAudio(data: any): void {
    const jomaji = data?.jomaji;

    if (!jomaji) {
      console.error('Không có nội dung jomaji để phát.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(jomaji);

    // Lấy danh sách giọng nói có hỗ trợ tiếng Nhật
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoice = voices.find((voice) => voice.lang.startsWith('ja'));

    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    } else {
      console.warn('Không tìm thấy giọng nói tiếng Nhật. Dùng giọng mặc định.');
    }

    // Phát âm
    speechSynthesis.speak(utterance);
  }

  loadListeningData(lessonId: number) {
    this.loading = true;
    this.error = null;

    const headers = {
      accept: '*/*',
    };

    this.http
      .get<any>(`${environment.apiUrl}/listening/${lessonId}/answers`, {
        headers,
      })
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.status && response.httpCode === 200) {
            this.listeningData = response.data;
            this.userAnswers = []; // Reset answers khi load data mới
            this.isSubmitted = false;
            console.log(
              'Listening data loaded successfully:',
              this.listeningData
            );
          } else {
            this.error = response.message || 'Không thể tải dữ liệu bài học';
            this.message.error(this.error);
          }
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Error loading listening data:', err);

          if (err.status === 0) {
            this.error =
              'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
          } else if (err.status === 404) {
            this.error = 'Không tìm thấy bài học này.';
          } else if (err.status >= 500) {
            this.error = 'Lỗi server. Vui lòng thử lại sau.';
          } else {
            this.error = err.error?.message || 'Đã xảy ra lỗi khi tải dữ liệu.';
          }

          this.message.error(this.error);
        },
      });
  }

  onAnswerChange(questionId: number, selectedChoiceId: number) {
    const question = this.listeningData?.questionResponseDtos.find(
      (q) => q.id === questionId
    );
    const selectedChoice = question?.questionChoiceResponseDtos.find(
      (c) => c.id === selectedChoiceId
    );

    if (selectedChoice) {
      const existingAnswerIndex = this.userAnswers.findIndex(
        (a) => a.questionId === questionId
      );
      const newAnswer: UserAnswer = {
        questionId,
        selectedChoiceId,
        selectedChoiceCode: selectedChoice.selectChoiceCode,
      };

      if (existingAnswerIndex >= 0) {
        this.userAnswers[existingAnswerIndex] = newAnswer;
      } else {
        this.userAnswers.push(newAnswer);
      }
    }
  }

  getUserAnswer(questionId: number): UserAnswer | undefined {
    return this.userAnswers.find((a) => a.questionId === questionId);
  }

  hasUserAnswer(questionId: number): boolean {
    return this.getUserAnswer(questionId) !== undefined;
  }

  canSubmit(): boolean {
    const totalQuestions = this.listeningData?.questionResponseDtos.length || 0;
    return this.userAnswers.length === totalQuestions;
  }

  submitQuiz() {
    if (!this.canSubmit()) {
      this.message.warning(
        'Vui lòng trả lời tất cả câu hỏi trước khi kiểm tra!'
      );
      return;
    }

    this.isSubmitted = true;
    const correctCount = this.getCorrectCount();
    const totalQuestions = this.getTotalQuestions();

    this.message.success(
      `Bạn đã hoàn thành bài kiểm tra! Kết quả: ${correctCount}/${totalQuestions} câu đúng`
    );
  }

  isQuestionCorrect(questionId: number): boolean {
    const userAnswer = this.getUserAnswer(questionId);
    if (!userAnswer) return false;

    const question = this.listeningData?.questionResponseDtos.find(
      (q) => q.id === questionId
    );
    if (!question) return false;

    const selectedChoice = question.questionChoiceResponseDtos.find(
      (c) => c.id === userAnswer.selectedChoiceId
    );
    return selectedChoice?.correct || false;
  }

  getResultMessage(question: Question): string {
    const isCorrect = this.isQuestionCorrect(question.id);
    const userAnswer = this.getUserAnswer(question.id);
    const selectedChoice = question.questionChoiceResponseDtos.find(
      (c) => c.id === userAnswer?.selectedChoiceId
    );

    if (isCorrect) {
      return `Chính xác! Bạn đã chọn đáp án ${selectedChoice?.selectChoiceCode}`;
    } else {
      const correctChoice = question.questionChoiceResponseDtos.find(
        (c) => c.correct
      );
      return `Sai rồi! Bạn đã chọn ${selectedChoice?.selectChoiceCode}, đáp án đúng là ${correctChoice?.selectChoiceCode}`;
    }
  }

  getCorrectCount(): number {
    return this.userAnswers.filter((answer) =>
      this.isQuestionCorrect(answer.questionId)
    ).length;
  }

  getTotalQuestions(): number {
    return this.listeningData?.questionResponseDtos.length || 0;
  }

  getAccuracyPercentage(): number {
    const total = this.getTotalQuestions();
    if (total === 0) return 0;
    return Math.round((this.getCorrectCount() / total) * 100);
  }
}
