import express from 'express';
import {
  orderCreation,
  getUserOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/create', orderCreation);
router.get('/orders/:userId', getUserOrders);

export default router;
