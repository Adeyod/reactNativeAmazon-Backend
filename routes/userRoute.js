import express from 'express';
import {
  registerUser,
  emailVerification,
  loginUser,
  addAddresses,
  getAllAddresses,
  getUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/addresses', addAddresses);
router.get('/get-user/:userId', getUserProfile);
router.get('/addresses/:userId', getAllAddresses);
router.get('/verify/:token', emailVerification);

export default router;
