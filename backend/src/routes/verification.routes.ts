import express from 'express';
import * as verificationController from '../controllers/verification.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

// Only admins can see pending list (for now)
// router.use(authorize('admin')); 

router.get('/pending', verificationController.getPendingCheckIns);
router.post('/:checkInId', verificationController.verifyCheckIn);

export default router;
