import { TestBed } from '@angular/core/testing';
import { Order, OrderStatus } from 'src/model/order.model';
import { OrderService } from '../order/order.service';

import { BotService } from './bot.service';

describe('BotService', () => {
  let service: BotService;
  let order: OrderService;
  let wait = (second: number) => jasmine.clock().tick(second * 1000);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotService);
    order = TestBed.inject(OrderService);
    jasmine.clock().install()
  });

  afterEach(() => {
    jasmine.clock().uninstall()
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add bot', () => {
    service.addBot()
    expect(service._bots.length).toEqual(1)
  });

  it('should remove bot', () => {
    service.addBot()
    service.removeBot()
    expect(service._bots.length).toEqual(0)
  });

  it('Bot should process the first order', () => {
    let first = new Order(false)
    let second = new Order(false)

    service.addBot()
    order.addOrder(first)
    order.addOrder(second)

    // wait for 1 sec for bot to take order
    wait(1)

    expect(service._bots[0].order).toEqual(first)
  });

  it('Bot should process the vip order', () => {
    let first = new Order(false)
    let second = new Order(true)

    service.addBot()
    order.addOrder(first)
    order.addOrder(second)

    // wait for 1 sec for bot to take order
    wait(1)

    expect(service._bots[0].order).toEqual(second)
  });

  it(`Bot should complete order in 10 seconds`, () => {
    let processTime = 10
    let normal = new Order(false, processTime)

    service.addBot()
    order.addOrder(normal)

    // wait for 10 sec for bot to complete order
    wait(10)

    expect(normal.status).toEqual(OrderStatus.Completed)
  });

  it(`Order should be in pending list after bot is removed`, () => {
    let normal = new Order(false)

    service.addBot()
    order.addOrder(normal)

    // wait for 1 sec for bot to take order
    wait(1)
    service.removeBot()

    expect(order._pendingOrders).toContain(normal)
  });
});
