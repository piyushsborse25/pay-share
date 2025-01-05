import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { BillService } from '../services/bill.service';
import { Bill } from '../entities/Bill';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NotifyService } from '../services/notify.service';

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

  constructor(public billService: BillService, public notify: NotifyService) {}

  ngOnInit(): void {}

  updateJsonData(): void {
    try {
      if (this.jsonString !== undefined) {
        this.jsonData = JSON.parse(this.jsonString);
        this.jsonString = JSON.stringify(this.jsonData, null, 2);
      }
    } catch (error) {
      this.notify.openSnackBar('Invalid JSON');
      this.jsonData = undefined;
    }
  }

  save() {
    this.billService
      .save(this.jsonData)
      .subscribe((result: Bill) => {
        this.jsonData = result;
        this.jsonString = JSON.stringify(this.jsonData, null, 2);
        this.notify.openSnackBar('Bill Saved Successfully');
      }, (error: HttpErrorResponse) => {
        this.notify.openSnackBar(error.error['errorMessage']);
      });
  }
}
