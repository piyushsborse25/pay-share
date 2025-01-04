import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../entities/bill';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(public http: HttpClient) {}

  public save(bill: Bill) {
    return this.http.post('http://localhost:8086/bill-service/bill/save', bill);
  }
}
