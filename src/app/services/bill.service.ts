import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../entities/Bill';
import { Item } from '../entities/Item';
import { Split } from '../entities/Split';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(public http: HttpClient) {}

  public save(bill: Bill) {
    return this.http.post('http://localhost:8086/bill-service/bill/save', bill);
  }

  public getAll() {
    return this.http.get<Bill[]>('http://localhost:8086/bill-service/bills');
  }

  public getBillById(billId: number) {
    return this.http.get<Bill>(
      `http://localhost:8086/bill-service/bill/${billId}`
    );
  }

  public getBillSplit(billId: number) {
    return this.http.get<Split[]>(
      `http://localhost:8086/bill-service/bill/${billId}/split`
    );
  }

  public getUserItems(billId: number, name: string) {
    return this.http.get<Item[]>(
      `http://localhost:8086/bill-service/bill/${billId}/person/${name}/items`
    );
  }

  public downloadBill(billId: number) {
    this.http.get(`http://localhost:8086/bill-service/bill/${billId}/download`, {responseType: 'blob'}).subscribe(
      (blob: Blob) => {
        saveAs(blob, 'bill.xlsx');
      },
      (err) => {
        console.error('Error downloading file:', err);
        alert('Failed to download file.');
      }
    );
  }

  private saveFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url); // Clean up URL object
  }
}
