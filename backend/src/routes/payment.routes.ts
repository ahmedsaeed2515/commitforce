import express from 'express';
import * as paymentController from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Webhook must be raw body usually, but let's stick to JSON for dev/simplified
router.post('/webhook', paymentController.handleWebhook);

router.use(protect);
router.post('/deposit', paymentController.createDeposit);

export default router;
