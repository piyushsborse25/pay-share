import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { BillService } from '../services/bill.service';
import { Bill } from '../entities/bill';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-json-bill-editor',
  standalone: true,
  imports: [NgxJsonViewerModule, CommonModule, FormsModule],
  templateUrl: './json-bill-editor.component.html',
  styleUrl: './json-bill-editor.component.css',
})
export class JsonBillEditorComponent implements OnInit {
  jsonData: Bill;
  jsonString: string;

  constructor(public billService: BillService) {}

  ngOnInit(): void {}

  updateJsonData(): void {
    try {
      if (this.jsonString !== undefined) {
        this.jsonData = JSON.parse(this.jsonString);
        this.jsonString = JSON.stringify(this.jsonData, null, 2);
      }
    } catch (error) {}
  }

  save() {
    this.billService
      .save(this.jsonData)
      .subscribe((result: Bill) => {
        this.jsonData = result;
        this.jsonString = JSON.stringify(this.jsonData, null, 2);
      });
  }
}
