import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../entities/Bill';
import { map, throwError, catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const billEditResolver: ResolveFn<Bill> = (route, state) => {
  let billId = parseInt(route.paramMap.get('billId'));
  const billService = inject(BillService);

  return billService.getBillById(billId).pipe(
    map((res) => res),
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      return throwError(error);
    })
  );
};
