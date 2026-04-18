import { Routes } from '@angular/router';
import { Catalog } from './components/catalog/catalog';

export const routes: Routes = [
  { path: '', component: Catalog },
  { path: 'catalog', component: Catalog },
  { path: '**', redirectTo: '' },
];
