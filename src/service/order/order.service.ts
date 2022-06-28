import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from 'src/model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  _pendingOrders: Order[] = []
  _completedOrders: Order[] = []
  pendingOrders = new BehaviorSubject<Order[]>(this._pendingOrders)
  completedOrders = new BehaviorSubject<Order[]>(this._completedOrders)

  constructor() { }

  addOrder(order: Order) {
    this._pendingOrders.push(order)
    this._pendingOrders = this.sortOrder(this._pendingOrders)
    this.pendingOrders.next(this._pendingOrders)
  }

  processOrder(): Order | undefined {
    // process the first order in the list
    let order = this._pendingOrders.shift()
    this.pendingOrders.next(this._pendingOrders)
    return order
  }

  completeOrder(order: Order) {
    this._completedOrders.push(order)
    this.completedOrders.next(this._completedOrders)
  }

  sortOrder(orders: Order[]): Order[] {
    // vip order should in front of normal order
    return orders.sort((A, B) => {
      if (A.vipOrder !== B.vipOrder) return A.vipOrder ? -1 : 1
      return (A.id < B.id) ? -1 : 1
    })
  }
}
