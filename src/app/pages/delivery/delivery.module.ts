import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryComponent } from './delivery.component';
import { DeliveryRoutingModule } from "./delivery-routing.module";

@NgModule({
  declarations: [
    DeliveryComponent
  ],
  imports: [
    CommonModule,
    DeliveryRoutingModule
  ]
})
export class DeliveryModule { }
