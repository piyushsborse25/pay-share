import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './bill-edit.component.html',
  styleUrl: './bill-edit.component.css',
})
export class BillEditComponent implements AfterViewInit, OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  bill: Bill;
  split: any[];
  participants = new Set<string>();
  paidByUser: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Item> = null;
  selection = new SelectionModel<Item>(true, []);
  displayedColumns = ['select', 'itemId', 'itemName', 'itemPrice', 'people'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notify: NotifyService,
    private billService: BillService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(map((data) => data['bill'])).subscribe(
      (res: Bill) => {
        this.bill = res;
        this.dataSource = new MatTableDataSource<Item>(this.bill.items);
        this.dataSource.paginator = this.paginator;
      },
      (error: HttpErrorResponse) => {}
    );
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

  getDate(dateStr: string): any {
    if (typeof dateStr === 'string') {
      const [day, month, year] = dateStr.split('/').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      return parsedDate;
    }

    return dateStr;
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
    console.log(this.selection.selected);
  }

  toggleSingle(dmItem: Item): void {
    this.selection.toggle(dmItem);
    console.log(this.selection.selected);
  }

  shouldEnable(dmItem: Item): string {
    return this.selection.isSelected(dmItem) ? '' : 'disabled';
  }

  comparePeopleFn(x: any, y: any): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  generateSplit(): void {
    // this.billService.getSplit(this.bill.billId).subscribe((res) => {
    //   this.split = res;
    // });
  }

  getPerson(uid: number): string {
    for (let person of this.participants) {
      // if (uid == person.uid) {
      //   return person.firstName;
      // }
    }
    return '';
  }

  parSel($event: Event) {
    console.log($event);
  }

  getIndex(idx: number): number {
    return this.paginator.pageSize * this.paginator.pageIndex + (idx + 1);
  }

  openItemDailog(split: any): void {
    // openItemViewDialog(this.dialog, this.bill.billId, split).subscribe(
    //   (res) => {
    //     console.log(res);
    //   }
    // );
  }

  save() {
    this.bill.participants = new Set([...this.participants]);
    console.log(this.bill);
  }
}
