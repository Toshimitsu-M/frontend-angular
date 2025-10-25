import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SearchResult {
  id: number;
  facilityName: string;
  notificationDate: string;
  fileName: string;
  category: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class Search implements OnInit {
  searchForm: FormGroup;
  searchResults: SearchResult[] = [];
  hasSearched = false;

  // サンプルデータ
  private sampleData: SearchResult[] = [
    { id: 1, facilityName: '東京第一施設', notificationDate: '2025-10-20 14:30', fileName: 'report_001.pdf', category: 'all' },
    { id: 2, facilityName: '大阪中央センター', notificationDate: '2025-10-21 09:15', fileName: 'document_002.xlsx', category: 'facility' },
    { id: 3, facilityName: '名古屋支店', notificationDate: '2025-10-22 16:45', fileName: 'data_003.pdf', category: 'report' },
    { id: 4, facilityName: '福岡営業所', notificationDate: '2025-10-23 11:20', fileName: 'summary_004.docx', category: 'all' },
    { id: 5, facilityName: '札幌事業所', notificationDate: '2025-10-24 13:00', fileName: 'report_005.pdf', category: 'facility' },
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      category: ['', Validators.required],
      keyword: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    if (this.searchForm.valid) {
      console.log('検索条件:', this.searchForm.value);
      const { category, keyword } = this.searchForm.value;
      
      this.searchResults = this.sampleData.filter(item => {
        const matchCategory = category === 'all' || item.category === category;
        const matchKeyword = 
          item.facilityName.toLowerCase().includes(keyword.toLowerCase()) ||
          item.fileName.toLowerCase().includes(keyword.toLowerCase());
        return matchCategory && matchKeyword;
      });
      
      this.hasSearched = true;
    } else {
      // バリデーションエラーを表示するためにフォームをタッチ
      Object.keys(this.searchForm.controls).forEach(key => {
        this.searchForm.get(key)?.markAsTouched();
      });
    }
  }

  onDownload(fileName: string): void {
    alert(`${fileName} をダウンロードします`);
    // 実際のダウンロード処理を実装
  }

  // バリデーションエラーメッセージを取得
  getErrorMessage(controlName: string): string {
    console.log('バリデーションチェック:', controlName);
    const control = this.searchForm.get(controlName);
    
    if (control?.hasError('required') && control.touched) {
      return controlName === 'category'
        ? 'カテゴリーを選択してください'
        : 'キーワードを入力してください';
    }
    
    if (control?.hasError('minlength') && control.touched) {
      return 'キーワードは2文字以上で入力してください';
    }
    
    return '';
  }

  // フォームコントロールにエラーがあるかチェック
  hasError(controlName: string): boolean {
    const control = this.searchForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}
