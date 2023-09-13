import {
  Listener,
  NotFoundError,
  OrderCanceledEvent,
  OrderStatus,
  Subjects,
} from '@easyexpress/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled

  queueGroupName: string = queueGroupName

  async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
    const orderId = data.id
    const order = await Order.findOne({
      version: data.version - 1,
      _id: data.id,
    })

    if (!order) throw new Error('Order not found!')

    order.set({ status: OrderStatus.Canceled })
    await order.save()

    msg.ack()
  }
}
