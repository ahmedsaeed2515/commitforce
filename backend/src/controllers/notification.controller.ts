import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as notificationService from '../services/notification.service';

/**
 * @desc    Get user notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.getUserNotifications(req.user!._id.toString());
  res.status(200).json(
    ApiResponse.success('Notifications fetched', notifications)
  );
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/v1/notifications/:id/read
 * @access  Private
 */
export const markRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAsRead(req.params.id, req.user!._id.toString());
  res.status(200).json(
    ApiResponse.success('Notification marked as read')
  );
});

/**
 * @desc    Mark all as read
 * @route   PUT /api/v1/notifications/read-all
 * @access  Private
 */
export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!._id.toString());
    res.status(200).json(
      ApiResponse.success('All notifications marked as read')
    );
  });
