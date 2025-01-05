import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor(public snackbar: MatSnackBar) {}

  openSnackBar(msg: string) {
    let config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar'],
      politeness: 'assertive',
      data: { message: 'Operation Successful!' },
    };

    this.snackbar.open(msg, 'Close', config);
  }
}
