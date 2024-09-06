import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './product.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ProductInfoResolver } from 'src/app/shared/services/product/product-info.resolver';

const routes: Routes = [
  { path: ':category', component: ProductComponent, },
  {
    path: ':category/:id',
    component: ProductInfoComponent,
    resolve: { productInfo: ProductInfoResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
