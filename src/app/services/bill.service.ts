import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../entities/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(public http: HttpClient) { }

  public save(bill: Bill) {
    this.http.post("http://localhost:8086/bill-service/bill/save", bill).subscribe(result => {
      console.log(result);
    });
  }
}
