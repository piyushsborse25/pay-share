import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { COMMA, ENTER, T } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { Bill } from '../entities/Bill';
import { Item } from '../entities/Item';
import { NotifyService } from '../services/notify.service';
import { BillService } from '../services/bill.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Split } from '../entities/Split';
import { openItemViewDialog } from '../dialogs/item-list/item-list.component';
import { openItemEditDialog } from '../dialogs/item-add/item-add.component';
import { openConfirmDialog } from '../dialogs/confirm/confirm.component';
import { ExtraPrice } from '../entities/ExtraPrice';

@Component({
  selector: 'app-bill-edit',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatChipsModule,
  ],
  templateUrl: './bill-edit.component.html',
  styleUrl: './bill-edit.component.css',
})
export class BillEditComponent implements AfterViewInit, OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  bill: Bill;
  splits: Split[];
  participants = new Set<string>();
  paidByUser: string = null;
  editable = true;

  isItemSelected: boolean = false;

  @ViewChild('itemsPaginator') paginator: MatPaginator;
  @ViewChild('extrasPaginator') paginatorExtras: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Item>;
  dataSourceExtras: MatTableDataSource<ExtraPrice>;

  selection = new SelectionModel<Item>(true, []);
  selectionExtras = new SelectionModel<ExtraPrice>(true, []);

  displayedColumns = ['select', 'itemId', 'itemName', 'itemPrice', 'people'];

  options: string[] = ['DISCOUNT', 'TAX', 'EXTRA_CHARGES', 'CASHBACK'];

  newItem: Item = {
    itemId: -1,
    name: null,
    quantity: null,
    rate: null,
    value: null,
    participants: [],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notify: NotifyService,
    private billService: BillService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private refresh: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(map((data) => data['bill'])).subscribe(
      (res: Bill) => {
        this.updateBill(res);
      },
      (error: HttpErrorResponse) => {}
    );

    this.route.data.pipe(map((data) => data['editable'])).subscribe(
      (isEditable: boolean) => {
        if (isEditable !== undefined) {
          this.editable = isEditable;
          this.generateSplit();
        } else {
          this.editable = true;
        }
      },
      (error: HttpErrorResponse) => {}
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSourceExtras.paginator = this.paginatorExtras;
  }

  updateBill(bill: Bill) {
    this.bill = bill;
    this.participants = new Set<string>(this.bill.participants);
    this.dataSource = new MatTableDataSource<Item>(this.bill.items);
    this.dataSourceExtras = new MatTableDataSource<ExtraPrice>(
      this.bill.extraPrices
    );
    this.selection.clear();
    this.selectionExtras.clear();
  }

  remove(item: string): void {
    this.participants.delete(item);
  }

  selected(input: HTMLInputElement): void {
    this.participants.add(input.value.toUpperCase());
    input.value = null;
  }

  removeItem() {
    openConfirmDialog(this.dialog, 'This will delete the Item.').subscribe(
      (del: boolean) => {
        if (del) {
          let items = this.dataSource.data;

          for (let item of this.selection.selected) {
            let idx = items.indexOf(item);
            if (idx !== -1) {
              items.splice(idx, 1);
            }
          }

          this.dataSource.data = items;
          this.selection.deselect(...this.selection.selected);
        }
      }
    );
  }

  removeExtra() {
    let extras: ExtraPrice[] = this.dataSourceExtras.data;

    for (let extra of this.selectionExtras.selected) {
      let idx = extras.indexOf(extra);
      if (idx !== -1) {
        extras.splice(idx, 1);
      }
    }

    this.dataSourceExtras.data = extras;
    this.selectionExtras.deselect(...this.selectionExtras.selected);
  }

  getDate(dateStr: string): any {
    if (typeof dateStr === 'string') {
      const [day, month, year] = dateStr.split('/').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      return parsedDate;
    }

    return dateStr;
  }

  getItemIdxItems(i: number): number {
    if (this.paginator !== undefined) {
      return this.paginator.pageIndex * this.paginator.pageSize + (i + 1);
    }
    return i + 1;
  }

  getItemIdxExtras(i: number): number {
    if (this.paginatorExtras !== undefined) {
      return (
        this.paginatorExtras.pageIndex * this.paginatorExtras.pageSize + (i + 1)
      );
    }
    return i + 1;
  }

  announceSortChange($event: Sort): void {}

  getPeopleString(people: string[]): string {
    return people.join(', ');
  }

  isAllSelectedItems(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedExtras(): boolean {
    const numSelected = this.selectionExtras.selected.length;
    const numRows = this.dataSourceExtras.data.length;
    return numSelected === numRows;
  }

  toggleAllSelectionItems(): void {
    if (this.isAllSelectedItems()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }

  toggleAllSelectionExtras(): void {
    if (this.isAllSelectedExtras()) {
      this.selectionExtras.clear();
    } else {
      this.selectionExtras.select(...this.dataSourceExtras.data);
    }
  }

  toggleSingleItems(dmItem: Item): void {
    this.selection.toggle(dmItem);
  }

  toggleSingleExtras(dmExtra: ExtraPrice): void {
    this.selectionExtras.toggle(dmExtra);
  }

  shouldEnableItems(dmItem: Item): string {
    return this.selection.isSelected(dmItem) ? '' : 'disabled';
  }

  shouldEnableExtras(dmExtra: ExtraPrice): string {
    return this.selectionExtras.isSelected(dmExtra) ? '' : 'disabled';
  }

  comparePeopleFn(x: any, y: any): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  generateSplit(): void {
    this.billService.getBillSplit(this.bill.billId).subscribe((res) => {
      this.splits = res;
    });
  }

  downloadBill(): void {
    this.billService.downloadBill(this.bill.billId);
  }

  downloadItems(): void {
    this.billService.downloadItems(this.selection.selected);
  }

  parSel($event: Event) {
    console.log($event);
  }

  getIndexItems(idx: number): number {
    return this.paginator.pageSize * this.paginator.pageIndex + (idx + 1);
  }

  getIndexExtras(idx: number): number {
    return (
      this.paginatorExtras.pageSize * this.paginatorExtras.pageIndex + (idx + 1)
    );
  }

  addItem() {
    if (this.participants.size != 0) {
      openItemEditDialog(this.dialog, this.newItem, [
        ...this.participants,
      ]).subscribe((res: Item) => {
        if (res !== null) {
          this.bill.items = [res, ...this.dataSource.data];
          this.dataSource.data = this.bill.items;
        }
      });
    } else {
      this.notify.openSnackBar('Please Add Participants');
    }
  }

  addExtra() {
    const emptyExtraPrice: ExtraPrice = {
      name: '',
      value: 0,
      type: 'EXTRA_CHARGES', // Default type, can be changed dynamically
    };

    this.bill.extraPrices = [emptyExtraPrice, ...this.dataSourceExtras.data];
    this.dataSourceExtras.data = this.bill.extraPrices;
  }

  enableEditItem() {
    let isOnlyOneSelected: boolean = this.selection.selected.length === 1;
    return isOnlyOneSelected ? '' : 'disabled';
  }

  enableDownloadItem() {
    let isOnlyOneSelected: boolean = this.selection.selected.length >= 1;
    return isOnlyOneSelected ? '' : 'disabled';
  }

  enableDeleteExtra() {
    let isOnlyOneSelected: boolean = this.selectionExtras.selected.length >= 1;
    return isOnlyOneSelected ? '' : 'disabled';
  }

  editItem() {
    if (this.participants.size != 0) {
      openItemEditDialog(this.dialog, this.selection.selected[0], [
        ...this.participants,
      ]).subscribe((res: Item) => {
        if (res !== null) {
          let temp = this.dataSource.data;
          let itr = 0;
          for (let itm of temp) {
            if (itm.itemId === res.itemId) {
              break;
            }
            itr++;
          }
          this.selection.deselect(temp[itr]);
          this.selection.select(res);
          temp[itr] = res;
          this.bill.items = temp;
          this.dataSource.data = this.bill.items;
        }
      });
    } else {
      this.notify.openSnackBar('Please Add Participants');
    }
  }

  isEditable() {
    return this.editable ? '' : 'disabled';
  }

  getIsItemSelected() {
    return this.selection.selected.length != 0;
  }

  openItemDailog(split: any): void {
    openItemViewDialog(this.dialog, this.bill.billId, split).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }

  save() {
    this.bill.participants = [...this.participants];

    let date = this.bill.billDate;
    let formattedDate = null;

    if (typeof date === 'string') {
      let [day, month, year] = date.split('/');
      formattedDate = `${day}/${month}/${year}`;
    } else {
      formattedDate = new Intl.DateTimeFormat('en-GB').format(new Date(date));
    }

    this.bill.billDate = formattedDate;

    this.billService.save(this.bill).subscribe(
      (result: Bill) => {
        this.notify.openSnackBar('Bill Saved Successfully');
        this.updateBill(result);
      },
      (error: HttpErrorResponse) => {
        this.notify.openSnackBar(error.error['errorMessage']);
      }
    );
  }
}
