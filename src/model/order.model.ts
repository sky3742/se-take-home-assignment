export enum OrderStatus {
    Pending = "PENDING",
    Processing = "PROCESSING",
    Completed = "COMPLETE"
}

export class Order {
    id: string
    status: string
    processDuration: number
    timeLeft: number
    vipOrder: boolean

    static orderCount: number = 0

    constructor(vipOrder: boolean, processTime: number = 10) {
        let count = (++Order.orderCount).toString().padStart(3, '0')
        this.id = `${vipOrder ? 'V' : 'N'}-${count}`
        this.vipOrder = vipOrder
        this.processDuration = processTime
        this.timeLeft = processTime
        this.status = OrderStatus.Pending
    }

    setProcessStatus() {
        this.timeLeft = this.processDuration
        this.status = OrderStatus.Processing
    }

    setCompletedStatus() {
        this.status = OrderStatus.Completed
    }

    setPendingStatus() {
        this.status = OrderStatus.Pending
    }
}
