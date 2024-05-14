import User from '../models/userModel.js';
import Order from '../models/orderModel.js';

const orderCreation = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.json({
        error: 'User not found',
        status: 404,
        success: false,
      });
    }

    // create an array of product objects from the cart
    const products = cartItems.map((item) => ({
      name: item?.title,
      price: item?.price,
      image: item?.image,
      quantity: item?.quantity,
    }));

    // create a new order
    const order = await new Order({
      user: userId,
      products,
      totalPrice,
      shippingAddress,
      paymentMethod,
    }).save();

    if (!order) {
      return res.json({
        error: 'Error creating order',
        status: 400,
        success: false,
      });
    } else {
      return res.json({
        message: 'Order created successfully',
        success: true,
        status: 200,
        order,
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
      message: 'Something went wrong',
      status: 500,
      success: false,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId }).populate(
      'user',
      '-password'
    );

    console.log(orders.length);

    if (!orders || orders.length === 0) {
      return res.json({
        error: 'No orders found',
        status: 404,
        success: false,
      });
    } else {
      return res.json({
        message: 'Orders fetched successfully',
        status: 200,
        success: true,
        orders,
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

export { orderCreation, getUserOrders };
