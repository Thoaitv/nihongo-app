import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface Question {
  id: number;
  type: 'reading' | 'vocabulary' | 'listening';
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  audio?: string;
  passage?: string;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  sectionResults: {
    reading: { correct: number; total: number };
    vocabulary: { correct: number; total: number };
    listening: { correct: number; total: number };
  };
}

@Component({
  selector: 'app-exam-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzRadioModule,
    NzInputModule,
    NzProgressModule,
    NzDividerModule,
    NzTagModule,
    NzMessageModule,
    NzTabsModule,
    NzResultModule,
    NzSpaceModule,
    NzIconModule,
    NzToolTipModule,
    NzModalModule,

    // NzStatisticModule,
    // NzStepsModule,
  ],
  templateUrl: './exam-student.component.html',
  styleUrl: './exam-student.component.scss',
})
export class ExamStudentComponent implements OnInit {
  questions: Question[] = [
    // Reading Questions
    {
      id: 1,
      type: 'reading',
      passage:
        '昨日、友達と一緒に新しいレストランに行きました。そのレストランは駅から歩いて5分のところにあります。料理はとても美味しくて、特に魚料理が素晴らしかったです。値段も手頃で、また行きたいと思いました。店員さんもとても親切で、気持ちよく食事をすることができました。',
      question: 'このレストランについて正しいのはどれですか。',
      options: [
        '駅から遠い場所にある',
        '料理の味が悪い',
        '値段が高い',
        '魚料理が美味しい',
      ],
      correct: 3,
      explanation: '文章中で「特に魚料理が素晴らしかった」と述べられています。',
    },
    {
      id: 2,
      type: 'reading',
      passage:
        '日本の夏は暑くて湿度が高いです。最近は地球温暖化の影響で、以前より暑くなっています。そのため、熱中症になる人が増えています。外出する時は帽子をかぶり、水分をこまめに取ることが大切です。',
      question: '日本の夏について述べられていることは何ですか。',
      options: [
        '涼しくて過ごしやすい',
        '以前より暑くなっている',
        '湿度が低い',
        '熱中症は減っている',
      ],
      correct: 1,
      explanation:
        '「地球温暖化の影響で、以前より暑くなっています」と書かれています。',
    },

    // Vocabulary Questions
    {
      id: 3,
      type: 'vocabulary',
      question: '会議の資料を（　　）してください。',
      options: ['準備', '用意', '支度', '手配'],
      correct: 1,
      explanation: '資料を「用意する」が最も適切な表現です。',
    },
    {
      id: 4,
      type: 'vocabulary',
      question: '彼は毎日（　　）に運動をしています。',
      options: ['真面目', '熱心', '丁寧', '親切'],
      correct: 1,
      explanation: '運動に対する積極的な態度を表すには「熱心に」が適切です。',
    },
    {
      id: 5,
      type: 'vocabulary',
      question: '「頑張る」の意味に最も近いのはどれですか。',
      options: ['努力する', '休憩する', '諦める', '遊ぶ'],
      correct: 0,
      explanation: '「頑張る」は「努力する」と同じ意味です。',
    },

    // Listening Questions
    {
      id: 6,
      type: 'listening',
      question:
        '音声を聞いて、正しい答えを選んでください。話者は何時に待ち合わせをしますか。',
      options: ['3時', '4時', '5時', '6時'],
      correct: 2,
      explanation: '音声では「5時に駅前で待ち合わせましょう」と言っています。',
    },
    {
      id: 7,
      type: 'listening',
      question:
        '音声を聞いて、天気予報の内容を答えてください。明日の天気は何ですか。',
      options: ['晴れ', '雨', '曇り', '雪'],
      correct: 1,
      explanation: '音声では「明日は一日中雨が降るでしょう」と言っています。',
    },
    {
      id: 8,
      type: 'listening',
      question: '音声を聞いて、話者の職業を答えてください。',
      options: ['医者', '教師', '料理人', '運転手'],
      correct: 1,
      explanation: '音声では「学校で子供たちに教えています」と言っています。',
    },
  ];

  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  userAnswers: (number | null)[] = [];
  showResults = false;
  testResult: any | null = null;
  timeRemaining = 1800; // 30 minutes
  timerInterval: any;
  startTime = new Date();

  constructor() {}

  ngOnInit() {
    this.initializeTest();
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  initializeTest() {
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.showResults = false;
    this.testResult = null;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.finishTest();
      }
    }, 1000);
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  getQuestionTypeColor(type: string): string {
    switch (type) {
      case 'reading':
        return 'green';
      case 'vocabulary':
        return 'blue';
      case 'listening':
        return 'purple';
      default:
        return 'default';
    }
  }

  getQuestionTypeIcon(type: string): string {
    switch (type) {
      case 'reading':
        return 'fas fa-book-open';
      case 'vocabulary':
        return 'fas fa-language';
      case 'listening':
        return 'fas fa-headphones';
      default:
        return 'fas fa-question';
    }
  }

  getQuestionTypeName(type: string): string {
    switch (type) {
      case 'reading':
        return '読解';
      case 'vocabulary':
        return '語彙';
      case 'listening':
        return '聴解';
      default:
        return '';
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  playAudio() {
    // Simulate audio playback
    // this.message.info('音声を再生中...');
    // In real implementation, you would play actual audio file
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer;
      this.currentQuestionIndex--;
      this.selectedAnswer = this.userAnswers[this.currentQuestionIndex];
    }
  }

  nextQuestion() {
    this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = this.userAnswers[this.currentQuestionIndex];
    } else {
      this.finishTest();
    }
  }

  finishTest() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer;
    this.calculateResults();
    this.showResults = true;
  }

  calculateResults() {
    const correctAnswers = this.userAnswers.filter(
      (answer, index) => answer === this.questions[index].correct
    ).length;

    const score = Math.round((correctAnswers / this.questions.length) * 100);
    const timeSpent = 1800 - this.timeRemaining;

    const sectionResults = {
      reading: this.calculateSectionResult('reading'),
      vocabulary: this.calculateSectionResult('vocabulary'),
      listening: this.calculateSectionResult('listening'),
    };

    this.testResult = {
      score,
      totalQuestions: this.questions.length,
      correctAnswers,
      timeSpent,
      sectionResults,
    };
  }

  calculateSectionResult(type: string) {
    const sectionQuestions = this.questions.filter((q) => q.type === type);
    const sectionAnswers = sectionQuestions.map((q) => {
      const index = this.questions.indexOf(q);
      return this.userAnswers[index] === q.correct;
    });

    return {
      correct: sectionAnswers.filter(Boolean).length,
      total: sectionQuestions.length,
    };
  }

  getSectionProgress(type: string): string {
    const sectionQuestions = this.questions.filter((q) => q.type === type);
    const answeredQuestions = sectionQuestions.filter((q) => {
      const index = this.questions.indexOf(q);
      return index <= this.currentQuestionIndex;
    });

    return `${answeredQuestions.length}/${sectionQuestions.length}`;
  }

  getSectionPercentage(type: string): number {
    const sectionQuestions = this.questions.filter((q) => q.type === type);
    const answeredQuestions = sectionQuestions.filter((q) => {
      const index = this.questions.indexOf(q);
      return index <= this.currentQuestionIndex;
    });

    return (answeredQuestions.length / sectionQuestions.length) * 100;
  }

  getResultIcon(): string {
    if (!this.testResult) return 'check-circle';
    if (this.testResult.score >= 80) return 'check-circle';
    if (this.testResult.score >= 60) return 'warning';
    return 'close-circle';
  }

  getResultTitle(): string {
    if (!this.testResult) return 'テスト完了';
    if (this.testResult.score >= 80) return 'おめでとうございます！';
    if (this.testResult.score >= 60) return 'もう少し頑張りましょう';
    return 'さらに勉強が必要です';
  }

  getResultSubtitle(): string {
    if (!this.testResult) return '';
    return `あなたのスコア: ${this.testResult.score}%`;
  }

  getScoreColor(): string {
    if (!this.testResult) return '#1890ff';
    if (this.testResult.score >= 80) return '#52c41a';
    if (this.testResult.score >= 60) return '#faad14';
    return '#ff4d4f';
  }

  getSectionResultColor(section: { correct: number; total: number }): string {
    const percentage = (section.correct / section.total) * 100;
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'orange';
    return 'red';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  restartTest() {
    this.timeRemaining = 1800;
    this.initializeTest();
    this.startTimer();
  }

  reviewAnswers() {
    // this.message.info('答えの確認機能は実装予定です。');
  }
  roundPercentage(correct: number, total: number): number {
    return Math.round((correct / total) * 100);
  }
}
