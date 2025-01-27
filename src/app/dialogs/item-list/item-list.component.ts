import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Item } from '../../entities/Item';
import { Split } from '../../entities/Split';
import { NotifyService } from '../../services/notify.service';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatChip,
    MatDatepickerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatToolbarModule,
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements AfterViewInit, OnInit {
  items: Item[];
  split: Split;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Item>;
  selection = new SelectionModel<Item>(true, []);
  displayedColumns = [
    'select',
    'itemId',
    'itemName',
    'itemPrice',
    'itemSplit',
    'people',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notify: NotifyService,
    private billService: BillService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.split = this.data['split'];
    let billId: number = this.data['billId'];
    this.billService.getUserItems(billId, this.split.name).subscribe((res) => {
      this.items = res;
      this.dataSource = new MatTableDataSource<Item>(this.items);
      this.dataSource.paginator = this.paginator;
    }, (error) => {});
  }

  ngAfterViewInit(): void {

  }

  announceSortChange(event: Sort) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.items.length;
    return numSelected === numRows;
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.items);
    }
  }

  toggleSingle(dmItem: Item) {
    this.selection.toggle(dmItem);
  }

  shouldEnable(dmItem: Item) {
    return this.selection.isSelected(dmItem) ? '' : 'disabled';
  }

  shouldEnableSaveAll() {
    return this.selection.hasValue() ? '' : 'disabled';
  }

  getPeopleString(people: string[]) {
    return people.join(', ');
  }

  getIndex(idx: number) {
    return this.paginator.pageSize * this.paginator.pageIndex + (idx + 1);
  }

  getHalf(item: Item): number {
    return parseFloat((item.value / item.participants.length).toFixed(2));
  }
}

export function openItemViewDialog(
  dialog: MatDialog,
  billId: number,
  split: Split
) {
  const config = new MatDialogConfig();
  config.disableClose = false;
  config.autoFocus = false;
  config.data = { split, billId };
  const dialogRef = dialog.open(ItemListComponent, config);
  return dialogRef.afterClosed();
}
