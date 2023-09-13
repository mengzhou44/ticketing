import request from 'supertest'
import { app } from '../../app'

import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const buildTicket = async () => { 
  const id = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    id,
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  return ticket
}

it('fetches orders fro a particular user', async () => {
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = global.signin()
  const userTwo = global.signin()

  const order1Response= await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const order2Response= await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .expect(200)

   
  expect(res.body.orders.length).toEqual(2)
  expect(res.body.orders[0].id).toEqual(order1Response.body.id)
  expect(res.body.orders[1].id).toEqual(order2Response.body.id)
  
})
