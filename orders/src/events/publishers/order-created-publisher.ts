import { OrderCreatedEvent, Publisher,Subjects } from '@easyexpress/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
     subject: Subjects.OrderCreated = Subjects.OrderCreated
     
}