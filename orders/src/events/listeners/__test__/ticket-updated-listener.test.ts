import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { TicketUpdatedEvent } from '@easyexpress/common'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  console.log("ticket.version", ticket.version)
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: ticket.title,
    price: 25,
    version: ticket.version + 1,
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('check if ticket price is updated', async () => {
  const { listener, data, ticket, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined()
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})


it('does not call ack if skipped a version', async () => {
    const { listener, data, msg } = await setup()
    data.version +=1
    try{
        await listener.onMessage(data, msg)
    }catch(err) {

    }
   
    expect(msg.ack).not.toHaveBeenCalled() 
})
  