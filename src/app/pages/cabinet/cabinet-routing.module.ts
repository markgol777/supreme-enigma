import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CabinetComponent } from './cabinet.component';
import { UserDataComponent } from './user-data/user-data.component';
import { UserOrderComponent } from './user-order/user-order.component';
import { UserFavoritesComponent } from './user-favorites/user-favorites.component';
import { UserPasswordComponent } from './user-password/user-password.component';

const routes: Routes = [
  { path: '', 
  component: CabinetComponent, 
  children: [
    { path: 'data', component: UserDataComponent },
    { path: 'order', component: UserOrderComponent },
    { path: 'favorite', component: UserFavoritesComponent },
    { path: 'password', component: UserPasswordComponent },
    { path: '', pathMatch: 'full', redirectTo: 'data' }
  ] 
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule { }
