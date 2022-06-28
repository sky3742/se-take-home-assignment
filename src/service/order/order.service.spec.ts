import { TestBed } from '@angular/core/testing';
import { Order } from 'src/model/order.model';

import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let normalOrder = new Order(false)
  let vipOrder = new Order(true)

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Adding order should be in pending list', () => {
    service.addOrder(normalOrder)
    expect(service._pendingOrders).toContain(normalOrder);
  });

  it('VIP should be sorted in front of normal', () => {
    let input = [normalOrder, vipOrder]
    let output = [vipOrder, normalOrder]
    expect(service.sortOrder(input)).toEqual(output);
  });

  it('VIP should be in front of normal in pending list', () => {
    service.addOrder(normalOrder)
    service.addOrder(vipOrder)
    expect(service._pendingOrders).toEqual([vipOrder, normalOrder]);
  });

  it('Processing order should not be in pending list', () => {
    service.addOrder(normalOrder)
    service.processOrder()
    expect(service._pendingOrders.some(order => order === normalOrder)).toBeFalse();
  });

  it('Completed order should be in completed list', () => {
    service.completeOrder(normalOrder)
    expect(service._completedOrders).toContain(normalOrder);
  });
});
