import { OrderCanceledListener } from '../order-canceled-listener'
import { OrderCanceledEvent } from '@easyexpress/common'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client)

  const orderId = new mongoose.Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    title: 'concert',
    price: 200,
    userId: 'asdf',
  })

  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCanceledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, msg, data }
}

it('sets the order id of the ticket to undefined', async () => {
  const { ticket, listener, msg, data } = await setup()

  await listener.onMessage(data, msg)

  const ticketUpdated = await Ticket.findById(ticket.id)

  expect(ticketUpdated!.orderId).toBeUndefined()
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publish a ticket updated event', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(ticketUpdatedData.orderId).toBeUndefined()
})
