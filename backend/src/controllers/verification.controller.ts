import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as verificationService from '../services/verification.service';

/**
 * @desc    Verify a check-in
 * @route   POST /api/v1/verifications/:checkInId
 * @access  Private (Admin/Verifier)
 */
export const verifyCheckIn = asyncHandler(async (req: Request, res: Response) => {
  const { checkInId } = req.params;
  const verifierId = req.user!._id.toString();
  const { status, notes } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be approved or rejected.');
  }

  const checkIn = await verificationService.verifyCheckIn(
    checkInId,
    verifierId,
    status,
    notes
  );

  res.status(200).json(
    ApiResponse.success(`Check-in ${status} successfully`, checkIn)
  );
});

/**
 * @desc    Get pending check-ins
 * @route   GET /api/v1/verifications/pending
 * @access  Private (Admin/Verifier)
 */
export const getPendingCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const checkIns = await verificationService.getPendingCheckIns();

  res.status(200).json(
    ApiResponse.success('Pending check-ins fetched', checkIns)
  );
});
