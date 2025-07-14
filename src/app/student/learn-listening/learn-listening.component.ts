import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';


interface ListeningLesson {
  id: number;
  title: string;
  titleJapanese: string ;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  duration: number;
  audioUrl: string;
  transcript: string;
  transcriptJapanese: string;
  category: string;
  difficulty: number;
  completed: boolean;
  progress: number;
  tags: any;
  description: string;
}

@Component({
  selector: 'app-learn-listening',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzTagModule,
    NzProgressModule,
    NzDividerModule,
    NzSpinModule,
    NzInputModule,
    NzSelectModule,
    NzSliderModule,
    NzModalModule,
    NzMessageModule,
    FormsModule,
  ],
  templateUrl: './learn-listening.component.html',
  styleUrl: './learn-listening.component.scss',
})
export class LearnListeningComponent implements OnInit, OnDestroy {
 private destroy$ = new Subject<void>();
  private audio: HTMLAudioElement | null = null;
  private progressUpdateInterval: any;
  
  // Signals
  allLessons = signal<ListeningLesson[]>([]);
  displayedLessons = signal<ListeningLesson[]>([]);
  currentLesson = signal<ListeningLesson | null>(null);
  isPlaying = signal(false);
  isLoading = signal(false);
  
  // Computed values
  completedLessons = computed(() => 
    this.allLessons().filter(lesson => lesson.completed).length
  );
  
  totalStudyTime = computed(() => 
    Math.round(this.allLessons()
      .filter(lesson => lesson.completed)
      .reduce((total, lesson) => total + lesson.duration, 0) / 3600)
  );
  
  averageScore = computed(() => {
    const completed = this.allLessons().filter(lesson => lesson.completed);
    return completed.length > 0 
      ? Math.round(completed.reduce((sum, lesson) => sum + lesson.progress, 0) / completed.length)
      : 0;
  });

  // Filter states
  selectedLevel: string | null = null;
  selectedCategory: string | null = null;
  maxDuration = 300;
  searchTerm = '';
  
  // UI states
  currentPlayingId: number | null = null;
  isTranscriptVisible = false;
  selectedLesson: ListeningLesson | null = null;
  showJapanese = false;
  
  // Audio states
  audioProgress = 0;
  playbackSpeed = 1;
  isLooping = false;
  currentTime = 0;
  totalDuration = 0;
  
  // Pagination
  currentPage = 1;
  pageSize = 12;


  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    this.loadInitialLessons();
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialLessons(): void {
    // Mock data - in real app, this would come from a service
    const mockLessons: ListeningLesson[] = [
      {
        id: 1,
        title: 'Daily Conversation at a Coffee Shop',
        titleJapanese: 'コーヒーショップでの日常会話',
        level: 'N5',
        duration: 120,
        audioUrl: '../../../../src/file_example_MP3_700KB.mp3',
        transcript:
          "A: Good morning! What would you like to order? B: I'd like a coffee, please. A: What size? B: Medium, please. A: That'll be 300 yen.",
        transcriptJapanese:
          'A: おはようございます！何をご注文されますか？ B: コーヒーをお願いします。 A: サイズはいかがですか？ B: Mサイズでお願いします。 A: 300円になります。',
        category: 'Daily Life',
        difficulty: 2,
        completed: true,
        progress: 95,
        tags: ['conversation', 'shopping', 'beginner'],
        description:
          'Learn basic conversation skills for ordering at a coffee shop',
      },
      {
        id: 2,
        title: 'Business Meeting Introduction',
        titleJapanese: 'ビジネスミーティングの紹介',
        level: 'N3',
        duration: 180,
        audioUrl: 'https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3',
        transcript:
          'Good morning, everyone. Let me introduce our new project manager, Tanaka-san. He will be leading the new marketing initiative.',
        transcriptJapanese:
          '皆さん、おはようございます。新しいプロジェクトマネージャーの田中さんをご紹介します。彼は新しいマーケティング活動を率いることになります。',
        category: 'Business',
        difficulty: 4,
        completed: false,
        progress: 0,
        tags: ['business', 'introduction', 'formal'],
        description:
          'Learn professional introduction phrases in business settings',
      },
      {
        id: 3,
        title: 'Travel Guide: Tokyo Sightseeing',
        titleJapanese: '旅行ガイド：東京観光',
        level: 'N4',
        duration: 240,
        audioUrl: 'https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3',
        transcript:
          "Welcome to Tokyo! Today we'll visit famous landmarks including Tokyo Tower, Senso-ji Temple, and Shibuya Crossing.",
        transcriptJapanese:
          '東京へようこそ！今日は東京タワー、浅草寺、渋谷交差点などの有名な観光地を訪れます。',
        category: 'Travel',
        difficulty: 3,
        completed: false,
        progress: 45,
        tags: ['travel', 'sightseeing', 'tokyo'],
        description:
          "Explore Tokyo's famous landmarks through guided audio tour",
      },
      {
        id: 4,
        title: 'Japanese Cultural Festivals',
        titleJapanese: '日本の文化祭り',
        level: 'N2',
        duration: 300,
        audioUrl: 'https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3',
        transcript:
          'Japanese festivals, or matsuri, are vibrant celebrations that showcase traditional culture, featuring music, dance, and local cuisine.',
        transcriptJapanese:
          '日本の祭り、すなわち「まつり」は、音楽、踊り、地元料理を特徴とする伝統文化を披露する活気ある祝祭です。',
        category: 'Culture',
        difficulty: 4,
        completed: true,
        progress: 100,
        tags: ['culture', 'festivals', 'traditions'],
        description:
          'Discover the rich tradition of Japanese festivals and celebrations',
      },
      {
        id: 5,
        title: 'News Report: Technology Innovation',
        titleJapanese: 'ニュース報道：技術革新',
        level: 'N1',
        duration: 360,
        audioUrl: 'https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3',
        transcript:
          "Recent developments in artificial intelligence and robotics are transforming Japan's industrial landscape and daily life.",
        transcriptJapanese:
          '人工知能とロボット工学の最近の発展は、日本の産業景観と日常生活を変革しています。',
        category: 'News',
        difficulty: 5,
        completed: false,
        progress: 0,
        tags: ['news', 'technology', 'innovation'],
        description:
          'Advanced news listening about technological developments in Japan',
      },
    ];

    // Generate more lessons for infinite scroll demo
    for (let i = 6; i <= 50; i++) {
      const levels: ('N5' | 'N4' | 'N3' | 'N2' | 'N1')[] = [
        'N5',
        'N4',
        'N3',
        'N2',
        'N1',
      ];
      const categories = [
        'Daily Life',
        'Business',
        'Travel',
        'Culture',
        'News',
      ];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      mockLessons.push({
        id: i,
        title: `Lesson ${i}: ${category} Practice`,
        titleJapanese: `レッスン${i}：${category}の練習`,
        level: level,
        duration: Math.floor(Math.random() * 300) + 60,
        audioUrl: '../../../../src/file_example_MP3_700KB.mp3',
        transcript: `This is a sample transcript for lesson ${i}...`,
        transcriptJapanese: `これはレッスン${i}のサンプル転写です...`,
        category: category,
        difficulty: Math.floor(Math.random() * 5) + 1,
        completed: Math.random() > 0.7,
        progress: Math.floor(Math.random() * 100),
        tags: ['sample', 'practice', level.toLowerCase()],
        description: `Practice ${category.toLowerCase()} vocabulary and expressions`,
      });
    }

    this.allLessons.set(mockLessons);
    this.updateDisplayedLessons();
  }

  setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1000
      ) {
        this.loadMoreLessons();
      }
    });
  }

  loadMoreLessons(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    // Simulate API call delay
    setTimeout(() => {
      this.currentPage++;
      this.updateDisplayedLessons();
      this.isLoading.set(false);
    }, 1000);
  }

  updateDisplayedLessons(): void {
    let filtered = this.allLessons();

    // Apply filters
    if (this.selectedLevel) {
      filtered = filtered.filter(
        (lesson) => lesson.level === this.selectedLevel
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(
        (lesson) => lesson.category === this.selectedCategory
      );
    }

    if (this.maxDuration < 600) {
      filtered = filtered.filter(
        (lesson) => lesson.duration <= this.maxDuration
      );
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(term) ||
          lesson.titleJapanese.includes(term) ||
          lesson.description.toLowerCase().includes(term) ||
          lesson.tags.some((tag: any) => tag.toLowerCase().includes(term))
      );
    }

    // Apply pagination
    const endIndex = this.currentPage * this.pageSize;
    this.displayedLessons.set(filtered.slice(0, endIndex));
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.updateDisplayedLessons();
  }

  onSearchChange(): void {
    // Debounce search
    setTimeout(() => {
      this.currentPage = 1;
      this.updateDisplayedLessons();
    }, 300);
  }

  playLesson(lesson: ListeningLesson): void {
    if (this.currentPlayingId === lesson.id) {
      this.togglePlayback();
    } else {
      this.currentLesson.set(lesson);
      this.currentPlayingId = lesson.id;
      this.isPlaying.set(true);
      this.message.success(`Now playing: ${lesson.title}`);
    }
  }

  togglePlayback(): void {
    this.isPlaying.set(!this.isPlaying());
  }

  changeSpeed(): void {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(this.playbackSpeed);
    this.playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
  }

  toggleLoop(): void {
    this.isLooping = !this.isLooping;
  }

  showTranscript(lesson: ListeningLesson): void {
    this.selectedLesson = lesson;
    this.isTranscriptVisible = true;
    this.showJapanese = false;
  }

  closeTranscript(): void {
    this.isTranscriptVisible = false;
    this.selectedLesson = null;
  }

  toggleBookmark(lesson: ListeningLesson): void {
    lesson.completed = !lesson.completed;
    if (lesson.completed) {
      lesson.progress = 100;
      this.message.success('Lesson completed!');
    } else {
      this.message.info('Lesson unmarked as completed');
    }
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Daily Life': 'green',
      Business: 'blue',
      Travel: 'orange',
      Culture: 'purple',
      News: 'red',
    };
    return colors[category] || 'default';
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatDuration = (value: number): string => {
    return `${Math.floor(value / 60)}min`;
  };

  trackByLessonId(index: number, lesson: ListeningLesson): number {
    return lesson.id;
  }
}
