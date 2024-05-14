import mongoose, { Schema } from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      name: { type: String, required: true },
      mobileNo: { type: String, required: true },
      houseNo: { type: String, required: true },
      street: { type: String, required: true },
      landmark: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
  },
  { timestamp: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
