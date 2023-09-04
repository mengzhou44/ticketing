import mongoose from 'mongoose'
import { app } from './app'
import { natsClient } from './nats-client'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }


  try {
    await natsClient.connect(process.env.NATSa_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!)

    natsClient.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })
    process.on('SIGINT', () => natsClient.client.close())
    process.on('SIGTERM', () => natsClient.client.close())

    await mongoose.connect(process.env.MONGO_URI!)
    console.log('Connected to MongoDb')
  } catch (err) {
    console.error(err)
  }
}

app.listen(3000, () => {
  console.log('Listening on port 3000!')
})

start()
