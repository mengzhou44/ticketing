import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Order } from '../models/order'
import {
  requireAuth,
  NotFoundError,
  BadRequestError,
  OrderStatus,
  validateRequest,
  NotAuthorizedError,
} from '@easyexpress/common'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,

  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) throw new NotFoundError()

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    if (order.status === OrderStatus.Canceled)
      throw new BadRequestError('can not pay for an order that is canceled')

    res.send({ success: true })
  }
)

export { router as createChargeRouter }
