import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsClient } from '../../nats-client'

const createTicket = async () => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'title2',
    price: 10,
  })
}

it('returns 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ price: 10, title: 'ticket1' })
    .expect(404)
})

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ price: 10, title: 'ticket1' })
    .expect(401)
})

it('returns 401 if the user is not ticket owner', async () => {
  const response = await createTicket()
  const ticketId = response.body.id

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin('1lk24j125l'))
    .send({ price: 10, title: 'ticket1' })
    .expect(401)
})

it('returns 400, if price or title is invalid', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  const cookie = global.signin()
  const response = await request(app)
    .post(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'ticket1' })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 100, title: '' })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdf' })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual('new title')
  expect(ticketResponse.body.price).toEqual(100)
})

it('publishes an event', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200)

  expect(natsClient.client.publish).toHaveBeenCalled()
})
