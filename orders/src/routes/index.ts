import { requireAuth } from '@easyexpress/common'
import express, { Request, Response } from 'express'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.currentUser!
  const orders = await Order.find({ userId: id }).populate('ticket')

  res.status(200).send({ orders })
})

export { router as indexOrderRouter }
