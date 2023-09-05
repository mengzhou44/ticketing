import { Publisher, Subjects, TicketCreatedEvent } from '@easyexpress/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
