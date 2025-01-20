import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChip } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Bill } from '../entities/Bill';
import { NotifyService } from '../services/notify.service';
import { BillService } from '../services/bill.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { openConfirmDialog } from '../dialogs/confirm/confirm.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-bills',
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
    MatDatepickerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatChip,
  ],
  templateUrl: './list-bills.component.html',
  styleUrl: './list-bills.component.css',
})
export class ListBillsComponent implements AfterViewInit, OnInit {
  bills: Bill[] = [];
  dataSource: MatTableDataSource<Bill>;
  selection = new SelectionModel<Bill>(true, []);
  displayedColumns = [
    'select',
    'billId',
    'store',
    'billDate',
    'totalItems',
    'totalQuantity',
    'totalValue',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notify: NotifyService,
    private billService: BillService,
    private liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBills();
  }

  ngAfterViewInit(): void {
    if (this.dataSource !== undefined) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private loadBills(): void {
    this.billService.getAll().subscribe(
      (result: Bill[]) => {
        this.bills = result;
        this.dataSource = new MatTableDataSource<Bill>(this.bills);
        this.dataSource.paginator = this.paginator;
      },
      (error: HttpErrorResponse) => {}
    );
  }

  enableEditBill() {
    let isOnlyOneSelected: boolean = this.selection.selected.length === 1;
    return isOnlyOneSelected ? '' : 'disabled';
  }

  enableDeleteBill() {
    let isOnlyOneSelected: boolean = this.selection.selected.length === 1;
    return isOnlyOneSelected ? '' : 'disabled';
  }

  getItemIdx(i: number): number {
    if (this.paginator !== undefined) {
      return this.paginator.pageIndex * this.paginator.pageSize + (i + 1);
    }
    return i + 1;
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(
        `Sorted ${sortState.active} ${sortState.direction}`
      );
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  getIndex() {
    throw new Error('Method not implemented.');
  }

  onViewHoverEnter(event: MouseEvent) {
    throw new Error('Method not implemented.');
  }

  onViewHoverLeave(event: MouseEvent) {
    throw new Error('Method not implemented.');
  }

  deleteBill() {
    if (this.selection.selected.length == 1) {
      openConfirmDialog(this.dialog, 'This will delete the Bill').subscribe(
        (value: boolean) => {
          if (value) {
            this.billService
              .deleteBillById(this.selection.selected[0].billId)
              .subscribe((deleted: boolean) => {
                if (deleted) {
                  this.notify.openSnackBar('Bill deleted Successfully');
                  let temp = this.dataSource.data;
                  let idx = temp.indexOf(this.selection.selected[0]);
                  this.selection.deselect(this.selection.selected[0]);
                  temp.splice(idx, 1);

                  this.dataSource.data = temp;
                } else {
                  this.notify.openSnackBar('Failed to delete bill');
                }
              });
          }
        }
      );
    }
  }

  edit() {
    if (this.selection.selected.length == 1) {
      this.router.navigateByUrl(
        `/edit-bill/${this.selection.selected[0].billId}`
      );
    }
  }

  view(): void {
    if (this.selection.selected.length == 1) {
      this.router.navigateByUrl(
        `/view-bill/${this.selection.selected[0].billId}/editable/false`
      );
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllSelection(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.selection.select(...this.dataSource.data);
  }

  toggleSingle(dmBill: Bill): void {
    this.selection.toggle(dmBill);
  }

  shouldEnable(dmBill: Bill): string {
    return this.selection.isSelected(dmBill) ? '' : 'disabled';
  }

  shouldEnableSaveAll(): string {
    return this.selection.hasValue() ? '' : 'disabled';
  }

  getDate(dateStr: string): Date {
    return new Date(dateStr);
  }
}
