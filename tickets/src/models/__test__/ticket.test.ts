import { Ticket } from '../ticket'

it('implments optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    userId: 'abc',
    title: 'concert',
    price: 5,
  })

  await ticket.save()

  const fetched1 = await Ticket.findById(ticket.id)
  const fetched2 = await Ticket.findById(ticket.id)

  fetched1!.set({ price: 10 })
  fetched2!.set({ price: 15 })

  await fetched1!.save()

  try {
    await fetched2!.save()
  } catch (error) {
    return
  }
  throw new Error('Should not reach this point!')
})

it('increments the version number by multiple saves', async () => {
  const ticket = Ticket.build({
    userId: 'abc',
    title: 'concert',
    price: 5,
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
 
  await ticket.save()
  expect(ticket.version).toEqual(1)
 
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
