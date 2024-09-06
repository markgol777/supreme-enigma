import { Component, OnInit } from '@angular/core';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  public basket: Array<IProductResponse> = [];
  public totalCount = 0;
  public totalPrice = 0;
  public basketIsOpen = false;

  constructor (
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadBasket();
    this.updateBasket();
  }

  loadBasket(): void {
    this.basket = [];
    if(localStorage.length > 0 && localStorage.getItem('tomatina_basket')) {
      this.basket = JSON.parse(localStorage.getItem('tomatina_basket') as string);
    }
    this.getTotalCount();
  }

  getTotalCount(): void {
    this.totalCount = this.basket
      .reduce((total: number, prod: IProductResponse) =>
      total + prod.count, 0);
    this.totalPrice = this.basket
      .reduce((total: number, prod: IProductResponse) =>
      total + prod.count * prod.price, 0);
  }

  updateBasket(): void {
    this.orderService.changeBasket
      .subscribe(() => {
        this.loadBasket();
      })
  }

  openBasket(): void {
    this.basketIsOpen = true;
  }

  closeBasket(): void {
    this.basketIsOpen = false;
  }

  clearBasket(): void {
    this.basket = [];
    localStorage.removeItem('tomatina_basket');
    this.orderService.changeBasket.next(true);
    this.closeBasket();
  }

  changeCount(product: IProductResponse, plus: boolean): void {
    if(plus) {
      ++product.count;
    } else if (!plus && product.count > 1) {
      --product.count;
    }
    localStorage.setItem('tomatina_basket', JSON.stringify(this.basket));
    this.orderService.changeBasket.next(true);
  }

  deleteFromBasket(product: IProductResponse): void {
    this.basket.splice(this.basket.indexOf(product), 1);
    localStorage.setItem('tomatina_basket', JSON.stringify(this.basket));
    this.orderService.changeBasket.next(true);
  }

}
