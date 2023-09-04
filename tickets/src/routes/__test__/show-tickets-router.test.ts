import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
 

const createTicket =async ()=> {
 
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: "title2",
    price: 10
  })
}

it('can fetch a list of tickets', async () => {
   await createTicket()
   await createTicket()
   await createTicket()
   
  const res = await request(app).get(`/api/tickets`)
  expect(res.body.length).toEqual(3)
   
})


it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); 
  await request(app).get(`/api/tickets/${id}`).expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert'
  const price = 20

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
