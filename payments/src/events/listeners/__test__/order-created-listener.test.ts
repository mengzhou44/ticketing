import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedEvent, OrderStatus } from '@easyexpress/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'wewewe',
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 200,
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, msg, data, orderId: data.id }
}

it('sets the order id of the ticket', async () => {
  const { listener, msg, data, orderId } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(orderId)

  expect(order).toBeDefined()
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
