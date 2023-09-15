import mongoose from 'mongoose'

interface PaymentAttrs {
  stripeId: string
  orderId: string
}

interface PaymentDoc extends mongoose.Document {
  stripeId: string
  orderId: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  })
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
)

export { Payment }
