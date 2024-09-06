import { Component, OnInit } from '@angular/core';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  public userFavorites!: Array<IProductResponse>;

  constructor(
    private accountService: AccountService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.initUserFavorites();
  }

  initUserFavorites(): void {
    this.userFavorites = this.accountService.userFavorites;
  }

  addToFavorite(product: IProductResponse): void {
    this.accountService.setFavorite(product);
  }

  isFavorite(id: string): boolean {
    return this.accountService.userFavorites.some(prod => prod.id === id);
  }

  fastOrder(product: IProductResponse): void {
    console.log('Швидке замовлення: ' + product.name);
  }

  changeCount(product: IProductResponse, plus: boolean): void {
    if(plus) {
      ++product.count;
    } else if (!plus && product.count > 1) {
      --product.count;
    }
  }

  addToBasket(product: IProductResponse): void {
    this.orderService.addToBasket(product);
    product.count = 1;
  }

}
