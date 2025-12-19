import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import pushNotificationService from '../services/pushNotification.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';

const router = Router();

/**
 * @route   GET /api/push/vapid-public-key
 * @desc    Get VAPID public key for client
 * @access  Public
 */
router.get('/vapid-public-key', (req: Request, res: Response) => {
  const publicKey = pushNotificationService.getPublicKey();
  
  if (!publicKey) {
    return res.status(503).json(
      ApiResponse.error('Push notifications not configured')
    );
  }
  
  res.json(ApiResponse.success('VAPID public key retrieved', { publicKey }));
});

/**
 * @route   POST /api/push/subscribe
 * @desc    Subscribe to push notifications
 * @access  Private
 */
router.post('/subscribe', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user._id.toString();
  const subscription = req.body;
  
  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json(
      ApiResponse.error('Invalid subscription data')
    );
  }
  
  pushNotificationService.saveSubscription(userId, subscription);
  
  // Send a test notification
  await pushNotificationService.sendToUser(userId, {
    title: '🔔 Notifications Enabled',
    body: 'You will now receive push notifications from CommitForce!',
    data: { type: 'test' },
  });
  
  res.json(ApiResponse.success('Successfully subscribed to push notifications'));
}));

/**
 * @route   POST /api/push/unsubscribe
 * @desc    Unsubscribe from push notifications
 * @access  Private
 */
router.post('/unsubscribe', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user._id.toString();
  
  pushNotificationService.removeSubscription(userId);
  
  res.json(ApiResponse.success('Successfully unsubscribed from push notifications'));
}));

/**
 * @route   POST /api/push/test
 * @desc    Send a test notification (development only)
 * @access  Private
 */
router.post('/test', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user._id.toString();
  const { title, body } = req.body;
  
  const success = await pushNotificationService.sendToUser(userId, {
    title: title || 'Test Notification',
    body: body || 'This is a test push notification!',
    data: { type: 'test' },
  });
  
  if (success) {
    res.json(ApiResponse.success('Test notification sent'));
  } else {
    res.status(400).json(ApiResponse.error('Failed to send test notification. Make sure you are subscribed.'));
  }
}));

export default router;
