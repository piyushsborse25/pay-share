import { Routes } from '@angular/router';
import { JsonBillEditorComponent } from './json-bill-editor/json-bill-editor.component';
import { ListBillsComponent } from './list-bills/list-bills.component';
import { BillEditComponent } from './bill-edit/bill-edit.component';
import { billEditResolver } from './resolvers/bill-edit/bill-edit.resolver';
import { editableResolver } from './resolvers/editable/editable.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/manage/import-bill',
    pathMatch: 'full',
  },
  {
    path: 'manage',
    children: [
      {
        path: 'import-bill',
        component: JsonBillEditorComponent,
      },
      {
        path: 'list-bills',
        component: ListBillsComponent,
      }
    ],
  },
  {
    path: 'edit-bill/:billId',
    component: BillEditComponent,
    resolve: {
      bill: billEditResolver
    }
  },
  {
    path: 'view-bill/:billId/editable/:editable',
    component: BillEditComponent,
    resolve: {
      bill: billEditResolver,
      editable: editableResolver
    }
  },
];
