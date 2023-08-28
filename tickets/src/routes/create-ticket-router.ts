import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, requireAuth} from '@easyexpress/common'
import { BadRequestError } from '@easyexpress/common'

const router = express.Router()

router.post(
  '/api/tickets',
  requireAuth,
  async (req: Request, res: Response) => {
    res.status(201).send('Ticket is created')
  }
)

export { router as createTicketRouter }
