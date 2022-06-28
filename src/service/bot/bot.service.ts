import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bot } from 'src/model/bot.model';
import { OrderService } from '../order/order.service';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  _bots: Bot[] = []
  bots = new BehaviorSubject<Bot[]>(this._bots)

  constructor(private orderService: OrderService) { }

  addBot() {
    let bot = new Bot()
    this.subscribeToEvents(bot)

    this._bots.push(bot)
    this.bots.next(this._bots)
  }

  removeBot() {
    let bot = this._bots.pop()
    if (!bot) return

    bot.cancel.next(true)
    Bot.botCount--
    this.bots.next(this._bots)
  }

  subscribeToEvents(bot: Bot) {
    this.processEvent(bot)
    this.completedEvent(bot)
    this.cancelledEvent(bot)
  }

  processEvent(bot: Bot) {
    let subProcess = bot.process.subscribe(processingOrder => {
      // unsubscribe when bot is not active
      if (!bot.active) subProcess.unsubscribe()

      // wait for bot free 
      if (processingOrder) return

      // look until a pending order is found or bot is removed
      let interval = setInterval(() => {
        if (bot.active) {
          let order = this.orderService.processOrder()
          if (!order) return

          bot.process.next(true)
          bot.processOrder(order)
        }
        clearInterval(interval)
      })
    })
  }

  completedEvent(bot: Bot) {
    let subComplete = bot.complete.subscribe(completed => {
      // bot is removed, unsubscribe the event
      if (!bot.active) subComplete.unsubscribe()

      // wait for bot to complete the order
      if (!completed) return

      // add completed order to completed order list
      let order = bot.completeOrder()
      if (order) this.orderService.completeOrder(order)

      bot.process.next(false)
    })
  }

  cancelledEvent(bot: Bot) {
    let subCancel = bot.cancel.subscribe(cancel => {
      if (!cancel) return

      // set active to false to indicate bot removal
      bot.active = false

      // triggers the event for unsubscribe
      bot.process.next(false)
      bot.complete.next(false)

      // add back order to pending 
      let order = bot.cancelProcessingOrder()
      if (order) this.orderService.addOrder(order)

      subCancel.unsubscribe()
    })
  }
}
