import { Component, OnInit } from '@angular/core';
import { IOrderResponse } from 'src/app/shared/interfaces/order/order.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  
  public userOrders!: IOrderResponse[];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  // load user orders
  loadOrders(): void {
    const currentUser = JSON.parse(localStorage.getItem('tomatina_currentUser') as string);
    if(currentUser) {
      this.orderService.getAllByUser(currentUser.uid)
        .subscribe(data => {
          this.userOrders = data as IOrderResponse[];
        })
    }
    // this.orderService.getAll()
    //   .subscribe(data => {
    //     this.userOrders = data as IOrderResponse[];
    //   })
  }

  createDate(date: string): Date {
    return new Date(date);
  }

  writeDelivery(delivery: string): string {
    return delivery === 'self pickup' ? 'Самовивіз' : `Кур'єром`;
  }

}
