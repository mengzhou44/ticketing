import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from '@easyexpress/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { OrderCanceledPublisher } from '../publishers/order-canceled-publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
  queueGroupName: string = queueGroupName
  async onMessage(data: { orderId: string }, msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) throw new NotFoundError()

    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }

    order.set({
      status: OrderStatus.Canceled,
    })

    await order.save()

    await new OrderCanceledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    msg.ack()
  }
}
