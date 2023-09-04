import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@easyexpress/common';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const found = await Ticket.findById(id)
    if (!found) {
         throw new NotFoundError();
    } else {
        res.status(200).send(found)
    }
  }
);

router.get(
    '/api/tickets',
    async (req: Request, res: Response) => {
        const tickets = await Ticket.find({})
        res.send(tickets)
    }
  );
  

export { router as showTicketsRouter };
