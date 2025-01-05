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
export class ListBillsComponent implements AfterViewInit {
  bills: Bill[] = [];
  dataSource: MatTableDataSource<Bill> = new MatTableDataSource<Bill>();
  selection = new SelectionModel<Bill>(true, []);
  displayedColumns = [
    'select',
    'billId',
    'store',
    'billDate',
    'totalItems',
    'totalQuantity',
    'totalValue',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notify: NotifyService,
    private billService: BillService,
    private liveAnnouncer: LiveAnnouncer
  ) {}

  ngAfterViewInit(): void {
    this.loadBills();
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

  delete(billId: any) {
    throw new Error('Method not implemented.');
  }

  edit(billId: any) {
    throw new Error('Method not implemented.');
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

  view(bill: Bill): void {
    // this.router.navigateByUrl(`/dm-view-bill/${bill.billId}`);
  }
}
