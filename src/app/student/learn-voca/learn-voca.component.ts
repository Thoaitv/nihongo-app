import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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

interface Vocabulary {
  id: number;
  japanese: string;
  hiragana: string;
  katakana?: string;
  vietnamese: string;
  pronunciation: string;
  example?: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

interface Topic {
  id: number;
  name: string;
  nameVi: string;
  color: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-learn-voca',
  standalone: true,
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
    FormsModule
  ],

  templateUrl: './learn-voca.component.html',
  styleUrl: './learn-voca.component.scss'
})
export class LearnVocaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  topics: Topic[] = [
    {
      id: 1,
      name: 'family',
      nameVi: 'Gia đình',
      color: '#ff6b6b',
      icon: 'fas fa-home',
      description: 'Từ vựng về thành viên gia đình và mối quan hệ'
    },
    {
      id: 2,
      name: 'food',
      nameVi: 'Đồ ăn',
      color: '#4ecdc4',
      icon: 'fas fa-utensils',
      description: 'Các loại thức ăn, đồ uống và thuật ngữ ẩm thực'
    },
    {
      id: 3,
      name: 'animals',
      nameVi: 'Động vật',
      color: '#45b7d1',
      icon: 'fas fa-paw',
      description: 'Tên các loài động vật và đặc điểm của chúng'
    },
    {
      id: 4,
      name: 'colors',
      nameVi: 'Màu sắc',
      color: '#f9ca24',
      icon: 'fas fa-palette',
      description: 'Các màu sắc cơ bản và nâng cao'
    },
    {
      id: 5,
      name: 'transportation',
      nameVi: 'Phương tiện giao thông',
      color: '#6c5ce7',
      icon: 'fas fa-car',
      description: 'Các loại phương tiện di chuyển và giao thông'
    },
    {
      id: 6,
      name: 'weather',
      nameVi: 'Thời tiết',
      color: '#00b894',
      icon: 'fas fa-cloud-sun',
      description: 'Từ vựng mô tả thời tiết và khí hậu'
    }
  ];

  vocabularies: { [key: number]: Vocabulary[] } = {
    1: [ // Family
      { id: 1, japanese: '家族', hiragana: 'かぞく', vietnamese: 'gia đình', pronunciation: 'kazoku', level: 'N5' },
      { id: 2, japanese: '父', hiragana: 'ちち', vietnamese: 'bố (kính ngữ)', pronunciation: 'chichi', level: 'N5' },
      { id: 3, japanese: '母', hiragana: 'はは', vietnamese: 'mẹ (kính ngữ)', pronunciation: 'haha', level: 'N5' },
      { id: 4, japanese: '兄', hiragana: 'あに', vietnamese: 'anh trai (kính ngữ)', pronunciation: 'ani', level: 'N5' },
      { id: 5, japanese: '姉', hiragana: 'あね', vietnamese: 'chị gái (kính ngữ)', pronunciation: 'ane', level: 'N5' },
      { id: 6, japanese: '弟', hiragana: 'おとうと', vietnamese: 'em trai', pronunciation: 'otouto', level: 'N5' },
      { id: 7, japanese: '妹', hiragana: 'いもうと', vietnamese: 'em gái', pronunciation: 'imouto', level: 'N5' },
      { id: 8, japanese: '祖父', hiragana: 'そふ', vietnamese: 'ông nội/ngoại', pronunciation: 'sofu', level: 'N4' },
      { id: 9, japanese: '祖母', hiragana: 'そぼ', vietnamese: 'bà nội/ngoại', pronunciation: 'sobo', level: 'N4' },
      { id: 10, japanese: '両親', hiragana: 'りょうしん', vietnamese: 'bố mẹ', pronunciation: 'ryoushin', level: 'N4' }
    ],
    2: [ // Food
      { id: 11, japanese: '食べ物', hiragana: 'たべもの', vietnamese: 'thức ăn', pronunciation: 'tabemono', level: 'N5' },
      { id: 12, japanese: '水', hiragana: 'みず', vietnamese: 'nước', pronunciation: 'mizu', level: 'N5' },
      { id: 13, japanese: 'ご飯', hiragana: 'ごはん', vietnamese: 'cơm', pronunciation: 'gohan', level: 'N5' },
      { id: 14, japanese: 'パン', hiragana: 'パン', katakana: 'パン', vietnamese: 'bánh mì', pronunciation: 'pan', level: 'N5' },
      { id: 15, japanese: '肉', hiragana: 'にく', vietnamese: 'thịt', pronunciation: 'niku', level: 'N5' },
      { id: 16, japanese: '魚', hiragana: 'さかな', vietnamese: 'cá', pronunciation: 'sakana', level: 'N5' },
      { id: 17, japanese: '野菜', hiragana: 'やさい', vietnamese: 'rau', pronunciation: 'yasai', level: 'N5' },
      { id: 18, japanese: '果物', hiragana: 'くだもの', vietnamese: 'trái cây', pronunciation: 'kudamono', level: 'N5' },
      { id: 19, japanese: '牛乳', hiragana: 'ぎゅうにゅう', vietnamese: 'sữa bò', pronunciation: 'gyuunyuu', level: 'N5' },
      { id: 20, japanese: '卵', hiragana: 'たまご', vietnamese: 'trứng', pronunciation: 'tamago', level: 'N5' }
    ],
    3: [ // Animals
      { id: 21, japanese: '動物', hiragana: 'どうぶつ', vietnamese: 'động vật', pronunciation: 'doubutsu', level: 'N5' },
      { id: 22, japanese: '犬', hiragana: 'いぬ', vietnamese: 'chó', pronunciation: 'inu', level: 'N5' },
      { id: 23, japanese: '猫', hiragana: 'ねこ', vietnamese: 'mèo', pronunciation: 'neko', level: 'N5' },
      { id: 24, japanese: '鳥', hiragana: 'とり', vietnamese: 'chim', pronunciation: 'tori', level: 'N5' },
      { id: 25, japanese: '馬', hiragana: 'うま', vietnamese: 'ngựa', pronunciation: 'uma', level: 'N5' },
      { id: 26, japanese: '牛', hiragana: 'うし', vietnamese: 'bò', pronunciation: 'ushi', level: 'N5' },
      { id: 27, japanese: '豚', hiragana: 'ぶた', vietnamese: 'lợn', pronunciation: 'buta', level: 'N5' },
      { id: 28, japanese: '象', hiragana: 'ぞう', vietnamese: 'voi', pronunciation: 'zou', level: 'N5' },
      { id: 29, japanese: '魚', hiragana: 'さかな', vietnamese: 'cá', pronunciation: 'sakana', level: 'N5' },
      { id: 30, japanese: '虫', hiragana: 'むし', vietnamese: 'côn trùng', pronunciation: 'mushi', level: 'N5' }
    ],
    4: [ // Colors
      { id: 31, japanese: '色', hiragana: 'いろ', vietnamese: 'màu sắc', pronunciation: 'iro', level: 'N5' },
      { id: 32, japanese: '赤', hiragana: 'あか', vietnamese: 'màu đỏ', pronunciation: 'aka', level: 'N5' },
      { id: 33, japanese: '青', hiragana: 'あお', vietnamese: 'màu xanh lam', pronunciation: 'ao', level: 'N5' },
      { id: 34, japanese: '黄色', hiragana: 'きいろ', vietnamese: 'màu vàng', pronunciation: 'kiiro', level: 'N5' },
      { id: 35, japanese: '緑', hiragana: 'みどり', vietnamese: 'màu xanh lá', pronunciation: 'midori', level: 'N5' },
      { id: 36, japanese: '白', hiragana: 'しろ', vietnamese: 'màu trắng', pronunciation: 'shiro', level: 'N5' },
      { id: 37, japanese: '黒', hiragana: 'くろ', vietnamese: 'màu đen', pronunciation: 'kuro', level: 'N5' },
      { id: 38, japanese: '紫', hiragana: 'むらさき', vietnamese: 'màu tím', pronunciation: 'murasaki', level: 'N4' },
      { id: 39, japanese: 'ピンク', hiragana: 'ピンク', katakana: 'ピンク', vietnamese: 'màu hồng', pronunciation: 'pinku', level: 'N5' },
      { id: 40, japanese: '茶色', hiragana: 'ちゃいろ', vietnamese: 'màu nâu', pronunciation: 'chairo', level: 'N5' }
    ],
    5: [ // Transportation
      { id: 41, japanese: '車', hiragana: 'くるま', vietnamese: 'xe hơi', pronunciation: 'kuruma', level: 'N5' },
      { id: 42, japanese: '電車', hiragana: 'でんしゃ', vietnamese: 'tàu điện', pronunciation: 'densha', level: 'N5' },
      { id: 43, japanese: 'バス', hiragana: 'バス', katakana: 'バス', vietnamese: 'xe buýt', pronunciation: 'basu', level: 'N5' },
      { id: 44, japanese: '自転車', hiragana: 'じてんしゃ', vietnamese: 'xe đạp', pronunciation: 'jitensha', level: 'N5' },
      { id: 45, japanese: '飛行機', hiragana: 'ひこうき', vietnamese: 'máy bay', pronunciation: 'hikouki', level: 'N5' },
      { id: 46, japanese: '船', hiragana: 'ふね', vietnamese: 'tàu thuyền', pronunciation: 'fune', level: 'N5' },
      { id: 47, japanese: 'タクシー', hiragana: 'タクシー', katakana: 'タクシー', vietnamese: 'taxi', pronunciation: 'takushii', level: 'N5' },
      { id: 48, japanese: '地下鉄', hiragana: 'ちかてつ', vietnamese: 'tàu điện ngầm', pronunciation: 'chikatetsu', level: 'N4' },
      { id: 49, japanese: '新幹線', hiragana: 'しんかんせん', vietnamese: 'tàu cao tốc', pronunciation: 'shinkansen', level: 'N4' },
      { id: 50, japanese: 'オートバイ', hiragana: 'オートバイ', katakana: 'オートバイ', vietnamese: 'xe máy', pronunciation: 'ootobai', level: 'N5' }
    ],
    6: [ // Weather
      { id: 51, japanese: '天気', hiragana: 'てんき', vietnamese: 'thời tiết', pronunciation: 'tenki', level: 'N5' },
      { id: 52, japanese: '晴れ', hiragana: 'はれ', vietnamese: 'nắng', pronunciation: 'hare', level: 'N5' },
      { id: 53, japanese: '雨', hiragana: 'あめ', vietnamese: 'mưa', pronunciation: 'ame', level: 'N5' },
      { id: 54, japanese: '雪', hiragana: 'ゆき', vietnamese: 'tuyết', pronunciation: 'yuki', level: 'N5' },
      { id: 55, japanese: '曇り', hiragana: 'くもり', vietnamese: 'nhiều mây', pronunciation: 'kumori', level: 'N5' },
      { id: 56, japanese: '風', hiragana: 'かぜ', vietnamese: 'gió', pronunciation: 'kaze', level: 'N5' },
      { id: 57, japanese: '暑い', hiragana: 'あつい', vietnamese: 'nóng', pronunciation: 'atsui', level: 'N5' },
      { id: 58, japanese: '寒い', hiragana: 'さむい', vietnamese: 'lạnh', pronunciation: 'samui', level: 'N5' },
      { id: 59, japanese: '涼しい', hiragana: 'すずしい', vietnamese: 'mát mẻ', pronunciation: 'suzushii', level: 'N5' },
      { id: 60, japanese: '暖かい', hiragana: 'あたたかい', vietnamese: 'ấm áp', pronunciation: 'atatakai', level: 'N5' }
    ]
  };

  selectedTopic: Topic | null = null;
  filteredVocabularies: Vocabulary[] = [];
  displayedVocabularies: Vocabulary[] = [];
  currentPage = 0;
  pageSize = 10;
  isLoading = false;
  hasMoreData = true;
  currentPlaying: number | null = null;
  searchTerm = '';
  selectedLevel: string | null = null;

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    // Initialize component
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTopic(topic: Topic) {
    this.selectedTopic = topic;
    this.filteredVocabularies = this.vocabularies[topic.id] || [];
    this.applyFilters();
    this.resetPagination();
    this.loadMoreVocabularies();
  }

  backToTopics() {
    this.selectedTopic = null;
    this.filteredVocabularies = [];
    this.displayedVocabularies = [];
    this.resetPagination();
  }

  resetPagination() {
    this.currentPage = 0;
    this.displayedVocabularies = [];
    this.hasMoreData = true;
  }

  loadMoreVocabularies() {
    if (this.isLoading || !this.hasMoreData) return;

    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      const newVocabularies = this.filteredVocabularies.slice(startIndex, endIndex);
      
      if (newVocabularies.length > 0) {
        this.displayedVocabularies = [...this.displayedVocabularies, ...newVocabularies];
        this.currentPage++;
        this.hasMoreData = endIndex < this.filteredVocabularies.length;
      } else {
        this.hasMoreData = false;
      }
      
      this.isLoading = false;
    }, 500);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.loadMoreVocabularies();
    }
  }

  playAudio(vocab: Vocabulary) {
    this.currentPlaying = vocab.id;
    
    // Create speech synthesis for Japanese pronunciation
    const utterance = new SpeechSynthesisUtterance(vocab.japanese);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    
    utterance.onend = () => {
      this.currentPlaying = null;
    };
    
    utterance.onerror = () => {
      this.currentPlaying = null;
      this.message.warning('Không thể phát âm thanh. Vui lòng thử lại!');
    };
    
    speechSynthesis.speak(utterance);
  }

  onSearch() {
    this.applyFilters();
    this.resetPagination();
    this.loadMoreVocabularies();
  }

  onLevelChange() {
    this.applyFilters();
    this.resetPagination();
    this.loadMoreVocabularies();
  }

  applyFilters() {
    if (!this.selectedTopic) return;
    
    let filtered = this.vocabularies[this.selectedTopic.id] || [];
    
    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(vocab => 
        vocab.japanese.toLowerCase().includes(searchLower) ||
        vocab.hiragana.toLowerCase().includes(searchLower) ||
        vocab.katakana?.toLowerCase().includes(searchLower) ||
        vocab.vietnamese.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply level filter
    if (this.selectedLevel) {
      filtered = filtered.filter(vocab => vocab.level === this.selectedLevel);
    }
    
    this.filteredVocabularies = filtered;
  }

  getVocabCount(topicId: number): number {
    return this.vocabularies[topicId]?.length || 0;
  }

  getLevelColor(level: string): string {
    const colors = {
      'N5': '#52c41a',
      'N4': '#1890ff',
      'N3': '#fa8c16',
      'N2': '#eb2f96',
      'N1': '#722ed1'
    };
    return colors[level as keyof typeof colors] || '#d9d9d9';
  }

  trackByVocabId(index: number, vocab: Vocabulary): number {
    return vocab.id;
  }
}