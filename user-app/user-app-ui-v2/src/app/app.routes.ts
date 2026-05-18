import { Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form-component/user-form-component';
import { UserListComponent } from './components/user-list-component/user-list-component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/users'
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
