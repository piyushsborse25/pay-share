import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-json-bill-editor',
  standalone: true,
  imports: [NgxJsonViewerModule, CommonModule, FormsModule],
  templateUrl: './json-bill-editor.component.html',
  styleUrl: './json-bill-editor.component.css',
})
export class JsonBillEditorComponent {
  jsonData: any = {};
  jsonString: string;

  updateJsonData(): void {
    try {
      this.jsonData = JSON.parse(this.jsonString);
      this.jsonString = JSON.stringify(this.jsonData, null, 2);
    } catch (error) {
      this.jsonData = { error: 'Invalid JSON format' };
    }
  }
}
