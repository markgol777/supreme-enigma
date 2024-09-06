import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IOrderRequest } from 'src/app/shared/interfaces/order/order.interface';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public basket: Array<IProductResponse> = [];
  public totalPrice = 0;
  public userForm!: FormGroup;
  public userDelivery!: string;
  private basketSubscribtion!: Subscription;
  private deliverySubscribtion!: Subscription;
  public isOrdered = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initUserForm();
    this.checkDelivery();
    this.checkUpdateDelivery();
    this.loadBasket();
    this.updateBasket();
  }

  ngOnDestroy(): void {
    if(this.deliverySubscribtion) {
      this.deliverySubscribtion.unsubscribe();
    }
    if(this.basketSubscribtion) {
      this.deliverySubscribtion.unsubscribe();
    }
  }

  initUserForm(): void {
    const currentUser = JSON.parse(localStorage.getItem('tomatina_currentUser') as string);
    if(currentUser) {
      this.userForm = this.fb.group({
        firstName: [currentUser.firstName, Validators.required],
        lastName: [currentUser.lastName, Validators.required],
        phoneNumber: [currentUser.phoneNumber, Validators.required],
        email: [currentUser.email, [Validators.required, Validators.email]],
        adress: [currentUser.adress]
      });
    } else {
      this.userForm = this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        adress: [null]
      });
    }
  }

  checkDelivery(): void {
    this.userDelivery =  JSON.parse(localStorage.getItem('tomatina_delivery') as string).delivery;
  }

  checkUpdateDelivery(): void {
    this.deliverySubscribtion = this.accountService.changeDelivery$
      .subscribe(() => {
        this.checkDelivery();
      });
  }

  loadBasket(): void {
    if(localStorage.length > 0 && localStorage.getItem('tomatina_basket')) {
      this.basket = JSON.parse(localStorage.getItem('tomatina_basket') as string);
    }
    this.getTotalCount();
  }

  getTotalCount(): void {
    this.totalPrice = this.basket
      .reduce((total: number, prod: IProductResponse) =>
      total + prod.count * prod.price, 0);
  }

  updateBasket(): void {
    this.basketSubscribtion = this.orderService.changeBasket
      .subscribe(() => {
        this.loadBasket();
      })
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

  createOrder(): void {
    const currentUser = JSON.parse(localStorage.getItem('tomatina_currentUser') as string);
    const user = this.userForm.value;
    const userId = currentUser ? currentUser.uid : '';
    const newOrder: IOrderRequest = {
      date: new Date().toString(),
      userId: userId,
      user: user,
      delivery: this.userDelivery,
      products: this.basket,
      sum: this.totalPrice,
      status: 'Замовлено'
    };
  this.orderService.create(newOrder)
    .then(() => {
      this.isOrdered = true;
      localStorage.removeItem('tomatina_basket');
      this.orderService.changeBasket.next(true);
      this.router.navigate(['/']);
    })
  }

}
