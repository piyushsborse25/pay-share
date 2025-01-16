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
        saveAs(blob, this.generateFileName('BILL'));
      },
      (err) => {
        console.error('Error downloading file:', err);
        alert('Failed to download file.');
      }
    );
  }

  public downloadItems(items: Item[]) {
    this.http.post(`http://localhost:8086/bill-service/items/download`, items, {responseType: 'blob'}).subscribe(
      (blob: Blob) => {
        saveAs(blob, this.generateFileName('ITEMS'));
      },
      (err) => {
        console.error('Error downloading file:', err);
        alert('Failed to download file.');
      }
    );
  }

  generateFileName(name: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    
    return `${name}_${timestamp}.xlsx`;
  }
}
