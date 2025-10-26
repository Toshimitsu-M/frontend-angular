import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ExcelData {
  sheets: { [key: string]: any[][] };
}

@Component({
  selector: 'app-file-io',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-io.html',
  styleUrls: ['./file-io.scss']
})
export class FileIo {
  selectedFileName: string | null = null;
  fileType: string | null = null;
  
  // PDF関連
  pdfText: string | null = null;
  
  // Excel関連
  excelData: ExcelData | null = null;
  selectedSheet: string = '';
  
  // 新規作成用
  newFileName: string = 'newfile';
  newExcelContent: string = '名前,年齢,部署\n山田太郎,30,営業部\n佐藤花子,25,開発部';

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'pdf') {
        this.fileType = 'pdf';
        await this.readPDF(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        this.fileType = 'excel';
        await this.readExcel(file);
      }
    }
  }

  async readPDF(file: File): Promise<void> {
    // PDFの読み込みはブラウザの制限により、実際にはPDF.jsなどのライブラリが必要
    // ここでは簡易的な実装として、テキスト抽出をシミュレート
    this.pdfText = `PDFファイル "${file.name}" が選択されました。\n\n` +
      `注意: 実際のPDF解析には pdf.js や pdfjs-dist などのライブラリが必要です。\n\n` +
      `このデモでは、以下のように実装できます:\n` +
      `1. npm install pdfjs-dist\n` +
      `2. PDFのテキストを抽出\n` +
      `3. 抽出したテキストを表示・編集可能に\n\n` +
      `サンプルテキスト:\n` +
      `これはPDFから抽出されたテキストのサンプルです。\n` +
      `実際の実装では、PDFの全ページからテキストを抽出して表示します。`;
  }

  async readExcel(file: File): Promise<void> {
    // ExcelJSやSheetJSを使用して読み込み
    // ここでは簡易的なデモデータを表示
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      // 実際にはSheetJS (xlsx) を使用してパース
      // npm install xlsx が必要
      
      // デモデータ
      this.excelData = {
        sheets: {
          'Sheet1': [
            ['名前', '年齢', '部署', '入社日'],
            ['山田太郎', '30', '営業部', '2020-04-01'],
            ['佐藤花子', '25', '開発部', '2021-07-15'],
            ['鈴木一郎', '35', '総務部', '2018-10-01'],
            ['田中美咲', '28', '営業部', '2019-06-01']
          ],
          'Sheet2': [
            ['商品名', '価格', '在庫'],
            ['ノートPC', '150000', '20'],
            ['マウス', '3000', '100'],
            ['キーボード', '8000', '50']
          ]
        }
      };
      
      const sheetNames = this.getSheetNames();
      if (sheetNames.length > 0) {
        this.selectedSheet = sheetNames[0];
      }
    };
    
    reader.readAsArrayBuffer(file);
  }

  getSheetNames(): string[] {
    return this.excelData ? Object.keys(this.excelData.sheets) : [];
  }

  downloadAsText(): void {
    if (!this.pdfText) return;
    
    const blob = new Blob([this.pdfText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = (this.selectedFileName || 'document') + '.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  downloadExcel(): void {
    if (!this.excelData) return;
    
    alert('実際のExcelダウンロードには xlsx ライブラリ (SheetJS) が必要です。\n' +
      'npm install xlsx を実行してインストールしてください。');
  }

  downloadAsCSV(): void {
    if (!this.excelData || !this.selectedSheet) return;
    
    const data = this.excelData.sheets[this.selectedSheet];
    const csv = data.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.selectedSheet + '.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  createExcel(): void {
    if (!this.newFileName || !this.newExcelContent) {
      alert('ファイル名とデータを入力してください');
      return;
    }
    
    // CSVデータをパース
    const rows = this.newExcelContent.split('\n').map(row => row.split(','));
    
    // CSV形式でダウンロード（実際のExcelにはxlsxライブラリが必要）
    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.newFileName + '.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    
    alert('注意: 実際のExcel形式 (.xlsx) で保存するには、\n' +
      'xlsx ライブラリをインストールして使用してください。\n' +
      '現在はCSV形式でダウンロードされます。');
  }

  clearContent(): void {
    this.selectedFileName = null;
    this.fileType = null;
    this.pdfText = null;
    this.excelData = null;
    this.selectedSheet = '';
  }
}