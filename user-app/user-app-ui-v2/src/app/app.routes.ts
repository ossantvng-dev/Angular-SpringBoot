import { Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form-component/user-form-component';
import { UserListComponent } from './components/user-list-component/user-list-component';
import { LoginComponent } from './components/login-component/login-component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { Unauthorized } from './components/unauthorized/unauthorized';
import { NotFoundComponent } from './components/not-found-component/not-found-component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard, roleGuard(['ROLE_USER', 'ROLE_ADMIN'])],
  },
  {
    path: 'users/create',
    component: UserFormComponent,
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
  },
  {
    path: 'unauthorized',
    component: Unauthorized,
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];
