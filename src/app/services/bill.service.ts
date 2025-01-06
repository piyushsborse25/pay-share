import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../entities/Bill';
import { Item } from '../entities/Item';
import { Split } from '../entities/Split';

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
    return this.http.get<Bill>(`http://localhost:8086/bill-service/bill/${billId}`);
  }

  public getBillSplit(billId: number) {
    return this.http.get<Split[]>(`http://localhost:8086/bill-service/bill/${billId}/split`);
  }

  public getUserItems(billId: number, name: string) {
    return this.http.get<Item[]>(`http://localhost:8086/bill-service/bill/${billId}/person/${name}/items`);
  }
}
