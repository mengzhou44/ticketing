import request from 'supertest'
import { app } from '../../app'

import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  return ticket
}

it('should able to fetch an order', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const order1Response = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const orderId = order1Response.body.id

  const orderResponse = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', userOne)
    .expect(200)

  expect(orderResponse.body.id).toEqual(orderId)
  expect(orderResponse.body.ticket.title).toEqual(ticketOne.title)
})



it('returns error if one user tries to fetch order from another user', async () => {
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
      .get(`/api/orders/${orderId}`)
      .set('Cookie', userTwo)
      .expect(401)
    
  })
  