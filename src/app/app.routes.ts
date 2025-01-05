import { Routes } from '@angular/router';
import { JsonBillEditorComponent } from './json-bill-editor/json-bill-editor.component';
import { ListBillsComponent } from './list-bills/list-bills.component';

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
];
