import { PaymentCreatedEvent, Publisher, Subjects } from '@easyexpress/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
