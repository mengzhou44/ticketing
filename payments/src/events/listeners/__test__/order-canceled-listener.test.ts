import { OrderCanceledListener } from '../order-canceled-listener'
import { OrderCanceledEvent, OrderStatus } from '@easyexpress/common'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client)
 
  const order = Order.build({
     id: new mongoose.Types.ObjectId().toHexString(),
     userId: 'asdf',
     status: OrderStatus.Created,
     version: 0, 
     price: 20
  })

  await order.save(); 

  const data: OrderCanceledEvent['data'] = {
      id: order.id, 
      version: 1,
      ticket: {
         id:  new mongoose.Types.ObjectId().toHexString(),
      }
  }
 
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, msg, data }
}

it('sets the order status to cancled', async () => {
  const { listener, msg, data } = await setup()

  await listener.onMessage(data, msg)

  const orderUpdated = await Order.findById(data.id)

  expect(orderUpdated!.status).toEqual(OrderStatus.Canceled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
 
