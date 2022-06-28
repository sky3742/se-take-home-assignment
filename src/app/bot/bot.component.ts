import { Component } from '@angular/core';
import { BotService } from 'src/service/bot/bot.service';
import { OrderService } from 'src/service/order/order.service';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent {

  constructor(public botService: BotService) { }

  addBot() {
    this.botService.addBot()
  }

  removeBot() {
    this.botService.removeBot()
  }
}
