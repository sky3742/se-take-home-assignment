import { Component } from '@angular/core';
import { Order } from 'src/model/order.model';
import { OrderService } from 'src/service/order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {

  constructor(public orderService: OrderService) { }


  addOrder(isVIP: boolean = false) {
    let order = new Order(isVIP)
    this.orderService.addOrder(order)
  }

}
