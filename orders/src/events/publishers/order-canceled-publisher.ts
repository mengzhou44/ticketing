import { OrderCanceledEvent, Publisher, Subjects } from '@easyexpress/common'

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled
}
