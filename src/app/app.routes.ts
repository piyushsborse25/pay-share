import { Routes } from '@angular/router';
import { JsonBillEditorComponent } from './json-bill-editor/json-bill-editor.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: JsonBillEditorComponent
  }
];
