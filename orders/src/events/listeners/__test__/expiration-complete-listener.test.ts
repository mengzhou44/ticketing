import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { ExpirationCompleteEvent, OrderStatus } from '@easyexpress/common';
 
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
   
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
     id: new mongoose.Types.ObjectId().toHexString(),
     title: 'concert',
     price: 20
  })

  await ticket.save(); 

  const order  = Order.build({
     userId: 'asft',
     expiresAt:  new Date(),
     status: OrderStatus.Created,
     ticket, 
  })

  await order.save()

  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId:  order.id
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order,  data, msg };
};

it('cancel an order', async () => {
  const { listener, data, msg } = await setup();

 
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.orderId);

  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Canceled);
});


it('emit order canceled event', async ()=> {
    const { listener, order,  data, msg } = await setup();

    await listener.onMessage(data, msg);

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(order.id)
})


it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

});
