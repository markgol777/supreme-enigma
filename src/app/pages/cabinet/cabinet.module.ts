import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { CabinetComponent } from './cabinet.component';
import { CabinetRoutingModule } from "./cabinet-routing.module";
import { UserDataComponent } from './user-data/user-data.component';
import { UserOrderComponent } from './user-order/user-order.component';
import { UserFavoritesComponent } from './user-favorites/user-favorites.component';
import { UserPasswordComponent } from './user-password/user-password.component';



@NgModule({
  declarations: [
    CabinetComponent,
    UserDataComponent,
    UserOrderComponent,
    UserFavoritesComponent,
    UserPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CabinetRoutingModule
  ]
})
export class CabinetModule { }
