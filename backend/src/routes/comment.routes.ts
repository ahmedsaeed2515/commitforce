import express from 'express';
import * as commentController from '../controllers/comment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Comment routes
router.post('/check-ins/:checkInId/comments', commentController.createComment);
router.get('/check-ins/:checkInId/comments', commentController.getComments);
router.post('/comments/:commentId/like', commentController.likeComment);
router.delete('/comments/:commentId', commentController.deleteComment);

export default router;
