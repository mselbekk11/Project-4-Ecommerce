import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // user who made the order
    orderItems: [
      // array of order items
      {
        name: { type: String, required: true }, // name of the product
        qty: { type: Number, required: true }, // quantity of the product
        image: { type: String, required: true }, // image of the product
        price: { type: Number, required: true }, // price of the product
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        }, // id of the product
      },
    ],
    shippingAddress: {
      // shipping address of the order
      address: { type: String, required: true }, // address of the order
      city: { type: String, required: true }, // city of the order
      postalCode: { type: String, required: true }, // postal code of the order
      country: { type: String, required: true }, // country of the order
    },
    paymentMethod: { type: String, required: true }, // payment method of the order
    paymentResult: {
      // payment result of the order
      id: { type: String }, // id of the payment
      status: { type: String }, // status of the payment
      update_time: { type: String }, // update time of the payment
      email_address: { type: String }, // email address of the payment
    },
    itemsPrice: { type: Number, required: true, default: 0.0 }, // price of the items
    taxPrice: { type: Number, required: true, default: 0.0 }, // tax price of the items
    shippingPrice: { type: Number, required: true, default: 0.0 }, // shipping price of the items
    totalPrice: { type: Number, required: true, default: 0.0 }, // total price of the items
    isPaid: { type: Boolean, required: true, default: false }, // if the order is paid
    paidAt: { type: Date }, // date when the order is paid
    isDelivered: { type: Boolean, required: true, default: false }, // if the order is delivered
    deliveredAt: { type: Date }, // date when the order is delivered
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
