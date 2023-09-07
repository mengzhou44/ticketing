import { Subjects, Listener, TicketUpdatedEvent } from '@easyexpress/common'

import { Ticket } from '../../models/ticket'

import { Message } from 'node-nats-streaming'

import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated

  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new Error('Ticket is not found')
    }

    ticket.set({ title, price })

    await ticket.save()

    msg.ack()
  }
}
