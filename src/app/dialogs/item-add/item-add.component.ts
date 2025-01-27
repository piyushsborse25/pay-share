import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MatChip,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCardActions } from '@angular/material/card';
import { NotifyService } from '../../services/notify.service';
import { BillService } from '../../services/bill.service';
import { Item } from '../../entities/Item';

@Component({
  selector: 'app-item-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatCardActions,
  ],
  templateUrl: './item-add.component.html',
  styleUrl: './item-add.component.css',
})
export class ItemAddComponent implements OnInit {
  form: FormGroup;
  isHidden: boolean = true;
  participants: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notify: NotifyService,
    private billService: BillService,
    private dialogRef: MatDialogRef<ItemAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let item: Item = this.data['item'];
    this.form = this.fb.group({
      itemId: [item.itemId],
      name: [item.name, [Validators.required, Validators.maxLength(200)]],
      value: [{ value: item.value, disabled: true }, [Validators.required]],
      quantity: [item.quantity, [Validators.required]],
      rate: [item.rate, [Validators.required]],
      participants: [item.participants],
    });
  }

  ngOnInit(): void {
    this.participants = this.data['participants'];
  }

  save(): void {
    if (this.validateForm()) {
      this.dialogRef.close(this.form.getRawValue());
    } else {
      this.notify.openSnackBar('Fill form correctly!');
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  calcValue() {
    let rate = parseFloat(this.form.get('rate').value);
    let quantity = parseFloat(this.form.get('quantity').value);

    if (!isNaN(rate) && !isNaN(quantity)) {
      this.form.get('value').setValue(rate * quantity);
    }
  }

  validateForm(): boolean {
    let isValid = true;
    Object.keys(this.form.controls).forEach((key) => {
      if (this.form.get(key)?.errors !== null) {
        isValid = false;
      }
    });
    return isValid;
  }
}

export function openItemEditDialog(
  dialog: MatDialog,
  item: Item,
  participants: string[]
): any {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.data = { item, participants };

  const dialogRef = dialog.open(ItemAddComponent, config);
  return dialogRef.afterClosed();
}
