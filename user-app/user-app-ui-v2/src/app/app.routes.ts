import { Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form-component/user-form-component';
import { UserListComponent } from './components/user-list-component/user-list-component';
import { LoginComponent } from './components/login-component/login-component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'users',
        component: UserListComponent
    },
    {
        path: 'users/create',
        component: UserFormComponent,
    },
    {
        path: 'users/edit/:id',
        component: UserFormComponent    
    }
];
