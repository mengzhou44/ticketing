import { Subjects, Publisher, TicketUpdatedEvent } from '@easyexpress/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
