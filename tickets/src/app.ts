import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import { errorHandler, NotFoundError } from '@easyexpress/common'
import cookieSession from 'cookie-session'
import { currentUser } from '@easyexpress/common'
import { createTicketRouter } from './routes/create-ticket-router'
import  {showTicketsRouter} from './routes/show-tickets-router'
import  {updateTicketRouter} from './routes/update-ticket-router'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false,
  })
)
app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketsRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }