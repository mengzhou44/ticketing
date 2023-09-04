import { Subjects, Publisher, TicketCreatedEvent } from '@easyexpress/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
