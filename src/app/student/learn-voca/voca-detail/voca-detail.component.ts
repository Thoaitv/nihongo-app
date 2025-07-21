import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-voca-detail',
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzTagModule,
    NzGridModule,
    NzSpinModule,
    NzDividerModule,
    NzTypographyModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    FormsModule,
  ],
  templateUrl: './voca-detail.component.html',
  styleUrl: './voca-detail.component.scss',
})
export class VocaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  vocabularyList: any[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 100000;
  topicId: any | null = null;
  isPlayingAudio: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const vocal = params['id'];
      if (vocal) {
        this.topicId = vocal;
        this.loadVocabulary();
      }
    });
  }

  loadVocabulary(): void {
    if (!this.topicId) return;

    this.loading = true;
    const url = `${environment.apiUrl}/vocabularies?limit=${this.pageSize}&page=${this.currentPage}&topicId=${this.topicId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.vocabularyList = response.data.list;
          this.totalPages = response.data.totalPage;
          this.totalItems = response.data.num;
          this.currentPage = response.data.currentPage;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vocabulary:', error);
        this.message.error(
          'Không thể tải danh sách từ vựng. Vui lòng thử lại!'
        );
        this.loading = false;
      },
    });
  }

  playAudio(vocab: any): void {
    if (this.isPlayingAudio === vocab.id) return;

    this.isPlayingAudio = vocab.id;

    if (vocab.audioLink) {
      const audio = new Audio(vocab.audioLink);

      audio.onended = () => {
        this.isPlayingAudio = null;
      };

      audio.onerror = () => {
        this.isPlayingAudio = null;
        // fallback nếu có jomaji
        if ('speechSynthesis' in window && vocab.jomaji) {
          const utterance = new SpeechSynthesisUtterance(vocab.jomaji);
          utterance.lang = 'ja-JP';
          utterance.rate = 0.8;
          speechSynthesis.speak(utterance);
        }
      };

      audio.play().catch(() => {
        this.isPlayingAudio = null;
      });
    } else if (vocab.jomaji && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(vocab.jomaji);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.onend = () => {
        this.isPlayingAudio = null;
      };
      speechSynthesis.speak(utterance);
    } else {
      this.isPlayingAudio = null;
    }

    console.log('vocab', vocab);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVocabulary();
  }

  goBack(): void {
    this.router.navigate(['/student/tu-vung']);
  }

  trackByVocabId(index: number, vocab: any): number {
    return vocab.id;
  }
}
