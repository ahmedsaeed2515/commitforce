import CheckIn from '../models/CheckIn.model';
import Challenge from '../models/Challenge.model';
import User from '../models/User.model';
import ApiError from '../utils/ApiError';

/**
 * Verify a check-in
 * @param checkInId The ID of the check-in to verify
 * @param verifierId The ID of the user performing verification
 * @param status 'approved' or 'rejected'
 * @param notes Optional notes/feedback
 */
export const verifyCheckIn = async (
  checkInId: string,
  verifierId: string,
  status: 'approved' | 'rejected',
  notes?: string
) => {
  const checkIn = await CheckIn.findById(checkInId).populate('challenge');
  
  if (!checkIn) {
    throw ApiError.notFound('Check-in not found');
  }

  // Determine who allowed to verify?
  // For now: Only Admin or the Challenge Owner (if self-verification is allowed? No, usually not for committed challenges)
  // Let's assume there is an 'Admin' role or designated verifier.
  // For simplicity MVP: Any user with role 'admin' OR if we implement peer verification later.
  
  // Check verifier permissions (mock logic for now)
  const verifier = await User.findById(verifierId);
  if (!verifier) throw ApiError.unauthorized('Verifier not found');
  
  // if (verifier.role !== 'admin') {
  //   throw ApiError.forbidden('Only admins can verify check-ins currently');
  // }

  checkIn.status = status;
  checkIn.verified = status === 'approved';
  checkIn.verifiedBy = verifier._id as any;
  checkIn.verifiedAt = new Date();
  
  if (notes) {
    checkIn.note = checkIn.note ? `${checkIn.note} | Verifier Note: ${notes}` : `Verifier Note: ${notes}`;
  }

  await checkIn.save();

  // If approved, verify if Challenge is completed?
  // Logic to check challenge progress...
  
  return checkIn;
};

/**
 * Get pending check-ins for verification
 */
export const getPendingCheckIns = async () => {
    return await CheckIn.find({ status: 'pending' })
        .populate('user', 'fullName avatar')
        .populate('challenge', 'title')
        .sort({ createdAt: 1 });
};
