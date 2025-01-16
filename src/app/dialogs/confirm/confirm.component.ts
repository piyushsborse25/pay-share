import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
})
export class ConfirmComponent implements OnInit {
  message: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = this.data['message'];
  }

  ngOnInit(): void {}

  confirmAction() {
    this.dialogRef.close(true);
  }

  closeConfirmationBox() {
    this.dialogRef.close(false);
  }
}

export function openConfirmDialog(dialog: MatDialog, message: string): any {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.data = { message };

  const dialogRef = dialog.open(ConfirmComponent, config);
  return dialogRef.afterClosed();
}
