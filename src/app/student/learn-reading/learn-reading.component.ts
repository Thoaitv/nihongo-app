import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';

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

interface ReadingLesson {
  id: number;
  title: string;
  content: string;
  jomaji: string;
  fileId: number | null;
  lessonType: string;
  questionResponseDtos: Question[];
}

interface UserAnswer {
  questionId: number;
  selectedChoice: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-learn-reading',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzRadioModule,
    NzDividerModule,
    NzTypographyModule,
    NzSpinModule,
    NzMessageModule,
    NzTagModule,
    NzProgressModule,
    NzModalModule,
    NzResultModule,
  ],
  templateUrl: './learn-reading.component.html',
  styleUrl: './learn-reading.component.scss',
})
export class LearnReadingComponent implements OnInit, OnDestroy {
  lessons: ReadingLesson[] = [];
  currentPage = 1;
  pageSize = 5;
  loading = false;
  hasMore = true;
  
  // Quiz state
  currentLessonAnswers: Map<number, UserAnswer> = new Map();
  showResults = false;
  currentLessonId: number | null = null;
  
  // Modal state
  isResultModalVisible = false;
  currentScore = 0;
  totalQuestions = 0;

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    this.loadLessons();
    this.setupInfiniteScroll();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  private setupInfiniteScroll() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  private onScroll() {
    const threshold = 100;
    const position = window.innerHeight + window.scrollY;
    const height = document.documentElement.scrollHeight;
    
    if (position >= height - threshold && !this.loading && this.hasMore) {
      this.loadMoreLessons();
    }
  }

  private loadLessons() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      const newLessons = this.generateMockLessons(this.currentPage, this.pageSize);
      this.lessons = [...this.lessons, ...newLessons];
      this.loading = false;
      this.currentPage++;
      
      // Simulate no more data after 20 lessons
      if (this.lessons.length >= 20) {
        this.hasMore = false;
      }
    }, 1000);
  }

  private loadMoreLessons() {
    if (!this.loading && this.hasMore) {
      this.loadLessons();
    }
  }

  private generateMockLessons(page: number, size: number): ReadingLesson[] {
    const lessons: ReadingLesson[] = [];
    const startId = (page - 1) * size + 1;
    
    for (let i = 0; i < size; i++) {
      const id = startId + i;
      lessons.push({
        id,
        title: `Bài đọc ${id}: ${this.getRandomTopic()}`,
        content: this.getRandomContent(),
        jomaji: this.getRandomJomaji(),
        fileId: null,
        lessonType: "READING",
        questionResponseDtos: this.generateRandomQuestions(id)
      });
    }
    
    return lessons;
  }

  private getRandomTopic(): string {
    const topics = [
      'Cuộc sống hàng ngày',
      'Gia đình và bạn bè',
      'Học tập ở trường',
      'Thời tiết và mùa',
      'Đồ ăn và nhà hàng',
      'Giao thông và du lịch',
      'Sở thích và giải trí',
      'Công việc và nghề nghiệp'
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private getRandomContent(): string {
    const contents = [
      '今日は天気がいいです。公園で友達と会いました。一緒に散歩をして、コーヒーを飲みました。とても楽しかったです。明日も会う予定です。',
      '昨日、家族と一緒に買い物に行きました。デパートで洋服を買いました。母は赤いドレスを買いました。父は黒いシャツを買いました。',
      '私の趣味は読書です。毎日図書館に行って、本を読みます。特に小説が好きです。今、日本の小説を読んでいます。',
      '学校で日本語を勉強しています。先生はとても親切です。クラスメートと一緒に練習します。日本語は難しいですが、面白いです。',
      '週末に友達と映画を見に行きました。アクション映画でした。とても面白かったです。映画の後、レストランで食事をしました。'
    ];
    return contents[Math.floor(Math.random() * contents.length)];
  }

  private getRandomJomaji(): string {
    const jomajis = [
      'kyou wa tenki ga ii desu. kouen de tomodachi to aimashita...',
      'kinou, kazoku to issho ni kaimono ni ikimashita...',
      'watashi no shumi wa dokusho desu. mainichi toshokan ni itte...',
      'gakkou de nihongo wo benkyou shite imasu. sensei wa totemo shinsetsu desu...',
      'shuumatsu ni tomodachi to eiga wo mi ni ikimashita...'
    ];
    return jomajis[Math.floor(Math.random() * jomajis.length)];
  }

  private generateRandomQuestions(lessonId: number): Question[] {
    const questions: Question[] = [];
    
    for (let i = 1; i <= 4; i++) {
      const questionId = lessonId * 100 + i;
      questions.push({
        id: questionId,
        questionText: `Câu hỏi ${i} về bài đọc ${lessonId}`,
        explanation: `Giải thích cho câu hỏi ${i}`,
        questionChoiceResponseDtos: [
          {
            id: questionId * 10 + 1,
            choiceText: `Lựa chọn A của câu ${i}`,
            selectChoiceCode: "A",
            correct: i === 1 // Đáp án A đúng cho câu 1
          },
          {
            id: questionId * 10 + 2,
            choiceText: `Lựa chọn B của câu ${i}`,
            selectChoiceCode: "B",
            correct: i === 2 // Đáp án B đúng cho câu 2
          },
          {
            id: questionId * 10 + 3,
            choiceText: `Lựa chọn C của câu ${i}`,
            selectChoiceCode: "C",
            correct: i === 3 // Đáp án C đúng cho câu 3
          },
          {
            id: questionId * 10 + 4,
            choiceText: `Lựa chọn D của câu ${i}`,
            selectChoiceCode: "D",
            correct: i === 4 // Đáp án D đúng cho câu 4
          }
        ]
      });
    }
    
    return questions;
  }

  onAnswerChange(questionId: number, selectedChoice: string, lesson: ReadingLesson) {
    const question = lesson.questionResponseDtos.find(q => q.id === questionId);
    if (question) {
      const correctChoice = question.questionChoiceResponseDtos.find(c => c.correct);
      const isCorrect = correctChoice?.selectChoiceCode === selectedChoice;
      
      this.currentLessonAnswers.set(questionId, {
        questionId,
        selectedChoice,
        isCorrect
      });
    }
  }

  submitQuiz(lesson: ReadingLesson) {
    const answers = Array.from(this.currentLessonAnswers.values());
    const lessonQuestions = lesson.questionResponseDtos;
    
    if (answers.length !== lessonQuestions.length) {
      this.message.warning('Vui lòng trả lời tất cả các câu hỏi!');
      return;
    }
    
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    this.currentScore = correctAnswers;
    this.totalQuestions = lessonQuestions.length;
    this.currentLessonId = lesson.id;
    
    this.isResultModalVisible = true;
    
    // Clear answers for next lesson
    this.currentLessonAnswers.clear();
  }

  resetQuiz(lesson: ReadingLesson) {
    this.currentLessonAnswers.clear();
    this.currentLessonId = null;
    this.showResults = false;
  }

  closeResultModal() {
    this.isResultModalVisible = false;
    this.currentLessonId = null;
  }

  getScoreColor(): string {
    const percentage = (this.currentScore / this.totalQuestions) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'exception';
  }

  getSelectedAnswer(questionId: number): string {
    return this.currentLessonAnswers.get(questionId)?.selectedChoice || '';
  }

  isQuestionAnswered(questionId: number): boolean {
    return this.currentLessonAnswers.has(questionId);
  }

  getAnsweredCount(lesson: ReadingLesson): number {
    return lesson.questionResponseDtos.filter(q => this.isQuestionAnswered(q.id)).length;
  }

  getProgressPercentage(lesson: ReadingLesson): number {
    const answered = this.getAnsweredCount(lesson);
    const total = lesson.questionResponseDtos.length;
    return (answered / total) * 100;
  }

  trackByLessonId(index: number, lesson: ReadingLesson): number {
    return lesson.id;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
