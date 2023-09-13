import  {Listener, OrderCanceledEvent, Subjects} from '@easyexpress/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
    subject: Subjects.OrderCanceled = Subjects.OrderCanceled

    queueGroupName:string  =queueGroupName

    async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
         const ticketId = data.ticket.id
         const ticket= await Ticket.findById(ticketId)
         if (!ticket) {
             throw new Error ('Ticket is not found')
         }

         ticket.set({orderId: undefined})
         await ticket.save()

         await  new TicketUpdatedPublisher(this.client).publish({
             id: ticket.id, 
             price: ticket.price,
             title: ticket.title,
             version: ticket.version,
             orderId: ticket.orderId,
             userId: ticket.userId
         })
         msg.ack();
    }
}