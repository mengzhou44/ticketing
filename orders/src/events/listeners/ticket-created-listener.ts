import { Subjects, Listener, TicketCreatedEvent } from '@easyexpress/common'

import { Ticket } from '../../models/ticket'

import { Message } from 'node-nats-streaming'

import { queueGroupName } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
     subject: Subjects.TicketCreated = Subjects.TicketCreated 

     queueGroupName  = queueGroupName

     async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
         const  { id,  title, price } = data
         console.log({title})

         const ticket = Ticket.build({ id,  title, price})

         await ticket.save()

         msg.ack();
     }


}
