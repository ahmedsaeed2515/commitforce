import express from 'express';
import * as verificationController from '../controllers/verification.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/pending', verificationController.getPendingCheckIns);
router.post('/:id', verificationController.verifyCheckIn);

export default router;
