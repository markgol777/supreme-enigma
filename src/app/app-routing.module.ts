import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'delivery', 
    loadChildren: () => import('./pages/delivery/delivery.module').then(n => n.DeliveryModule)
  },
  {
    path: 'about', 
    loadChildren: () => import('./pages/about/about.module').then(n => n.AboutModule)
  },
  {
    path: 'contact', 
    loadChildren: () => import('./pages/contact/contact.module').then(n => n.ContactModule)
  },
  {
    path: 'product', 
    loadChildren: () => import('./pages/product/product.module').then(n => n.ProductModule)
  },
  {
    path: 'checkout', 
    loadChildren: () => import('./pages/checkout/checkout.module').then(n => n.CheckoutModule)
  },
  {
    path: 'favorites', 
    loadChildren: () => import('./pages/favorites/favorites.module').then(n => n.FavoritesModule)
  },
  {
    path: 'cabinet', 
    canLoad: [AuthGuard],
    loadChildren: () => import('./pages/cabinet/cabinet.module').then(n => n.CabinetModule)
  },
  {
    path: 'admin', 
    canLoad: [AuthGuard],
    loadChildren: () => import('./admin/admin.module').then(n => n.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
