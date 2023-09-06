import request from 'supertest'
import { app } from '../../app'

import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@easyexpress/common'
import { natsWrapper } from '../../nats-wrapper'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  return ticket
}

it('should able to delete an order', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const order1Response = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const orderId = order1Response.body.id

  const orderResponse = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', userOne)

  expect(orderResponse.body.status).toEqual(OrderStatus.Canceled)
})

it('should emit order cancelled event', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const order1Response = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const orderId = order1Response.body.id

  await request(app).delete(`/api/orders/${orderId}`).set('Cookie', userOne)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('should return error if user try to delete an order of another user', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const order1Response = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const orderId = order1Response.body.id

  const userTwo = global.signin()
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', userTwo)
    .expect(401)
})
