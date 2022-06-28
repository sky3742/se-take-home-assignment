import { BehaviorSubject } from "rxjs"
import { Order } from "./order.model"

export class Bot {
    id: string
    active: Boolean = true

    order: Order | undefined = undefined
    process = new BehaviorSubject<boolean>(false)
    complete = new BehaviorSubject<boolean>(false)
    cancel = new BehaviorSubject<boolean>(false)

    static botCount: number = 0

    constructor() {
        let count = (++Bot.botCount).toString().padStart(3, '0')
        this.id = `Bot-${count}`
    }

    processOrder(order: Order) {
        this.order = order
        this.order.setProcessStatus()

        let interval = setInterval(() => {
            if (this.order) {
                --this.order.timeLeft
                if (this.order.timeLeft !== 0) return
                this.complete.next(true)
            }
            clearInterval(interval)
        }, 1000)
    }

    cancelProcessingOrder(): Order | undefined {
        let order = this.order
        this.order = undefined
        order?.setPendingStatus()
        return order
    }

    completeOrder(): Order | undefined {
        let order = this.order
        this.order = undefined
        order?.setCompletedStatus()
        return order
    }
}