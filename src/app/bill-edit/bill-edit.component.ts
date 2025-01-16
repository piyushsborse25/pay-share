import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { B, COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { Bill } from '../entities/Bill';
import { Item } from '../entities/Item';
import { NotifyService } from '../services/notify.service';
import { BillService } from '../services/bill.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Split } from '../entities/Split';
import { saveAs } from 'file-saver';
import { openItemViewDialog } from '../dialogs/item-list/item-list.component';
import { openItemEditDialog } from '../dialogs/item-add/item-add.component';

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

  isItemSelected: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Item>;
  selection = new SelectionModel<Item>(true, []);
  displayedColumns = ['select', 'itemId', 'itemName', 'itemPrice', 'people'];

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
        this.bill = res;
        this.participants = new Set<string>(this.bill.participants);
        this.dataSource = new MatTableDataSource<Item>(this.bill.items);
      },
      (error: HttpErrorResponse) => {}
    );
    // this.generateSplit();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  remove(item: string): void {
    this.participants.delete(item);
  }

  selected(input: HTMLInputElement): void {
    this.participants.add(input.value.toUpperCase());
    input.value = null;
  }

  removeItem() {
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

  getDate(dateStr: string): any {
    if (typeof dateStr === 'string') {
      const [day, month, year] = dateStr.split('/').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      return parsedDate;
    }

    return dateStr;
  }

  getItemIdx(i: number): number {
    if (this.paginator !== undefined) {
      return this.paginator.pageIndex * this.paginator.pageSize + (i + 1);
    }
    return i + 1;
  }

  announceSortChange($event: Sort): void {}

  getPeopleString(people: string[]): string {
    return people.join(', ');
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }

  toggleSingle(dmItem: Item): void {
    this.selection.toggle(dmItem);
  }

  shouldEnable(dmItem: Item): string {
    return this.selection.isSelected(dmItem) ? '' : 'disabled';
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

  getIndex(idx: number): number {
    return this.paginator.pageSize * this.paginator.pageIndex + (idx + 1);
  }

  addItem() {
    let newItem: Item = {
      itemId: -1,
      name: '',
      quantity: -1,
      rate: -1,
      value: -1,
      participants: [],
    };
    openItemEditDialog(this.dialog, newItem, [...this.participants]).subscribe(
      (res: Item) => {
        if (res !== null) {
          console.log(res);
          this.bill.items = [res, ...this.dataSource.data];
          this.dataSource.data = this.bill.items;
        }
      }
    );
  }

  enableEditItem() {
    let isOnlyOneSelected: boolean = this.selection.selected.length === 1;
    return isOnlyOneSelected? '': 'disabled';
  }

  editItem() {
    openItemEditDialog(this.dialog, this.selection.selected[0], [...this.participants]).subscribe(
      (res: Item) => {
        if (res !== null) {
          console.log(res);
          this.bill.items = [res, ...this.dataSource.data];
          this.dataSource.data = this.bill.items;
        }
      }
    );
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
    this.bill.billDate = this.datePipe.transform(this.bill.billDate, 'dd/MM/yyyy'); 
    console.log(this.bill);
    this.billService.save(this.bill).subscribe(
      (result: Bill) => {
        this.notify.openSnackBar('Bill Saved Successfully');
        // this.generateSplit();
      },
      (error: HttpErrorResponse) => {
        this.notify.openSnackBar(error.error['errorMessage']);
      }
    );
  }
}
