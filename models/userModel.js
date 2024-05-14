import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    addresses: [
      {
        name: { type: String },
        mobileNo: { type: String },
        houseNo: { type: String },
        street: { type: String },
        landmark: { type: String },
        city: { type: String },
        country: { type: String },
        postalCode: { type: String },
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
