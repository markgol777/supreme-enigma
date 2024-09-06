import { Component, OnInit } from '@angular/core';
import { IOrderRequest, IOrderResponse } from 'src/app/shared/interfaces/order/order.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss']
})
export class AdminOrderComponent implements OnInit {

  public adminOrders!: IOrderResponse[];
  private allOrders = true;

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.orderService.getAll()
      .subscribe(data => {
        this.adminOrders = data as IOrderResponse[];
        this.allOrders = true;
      })
  }

  loadNewOrders(): void {
    this.orderService.getAllByStatus()
      .subscribe(data => {
        this.adminOrders = data as IOrderResponse[];
        this.allOrders = false;
      })
  }

  createDate(date: string): Date {
    return new Date(date);
  }

  writeDelivery(delivery: string): string {
    return delivery === 'self pickup' ? 'Самовивіз' : `Кур'єром`;
  }

  completeOrder(order: IOrderResponse): void {
    order.status = 'Виконано';
    this.orderService.update(order, order.id)
      .then(() => {
        this.allOrders ? this.loadAllOrders() : this.loadNewOrders();
        
      })
  }

}
