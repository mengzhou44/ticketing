import { Publisher, Subjects, ExpirationCompleteEvent } from '@easyexpress/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
