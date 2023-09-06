import {
  requireAuth,
  OrderStatus,
  NotFoundError,
  NotAuthorizedError,
} from '@easyexpress/common'
import express, { Request, Response } from 'express'
import { Order } from '../models/order'
import { OrderCanceledPublisher } from '../events/publishers/order-canceled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) throw new NotFoundError()

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    order.status = OrderStatus.Canceled
    await order.save()

    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      },
    })

    res.send(order)
  }
)

export { router as deleteOrderRouter }
