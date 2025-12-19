import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model';
import ApiError from '../utils/ApiError';
import config from '../config/env';
import emailService from './email.service';

/**
 * Generate JWT Tokens
 */
export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRY } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { id: userId },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as { id: string };
    return decoded.id;
  } catch (error) {
    throw ApiError.unauthorized('Invalid refresh token');
  }
};

/**
 * Register new user
 */
export const registerUser = async (userData: {
  email: string;
  password: string;
  username: string;
  fullName: string;
}) => {
  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: userData.email }, { username: userData.username }]
  });

  if (existingUser) {
    if (existingUser.email === userData.email) {
      throw ApiError.conflict('Email already registered');
    }
    throw ApiError.conflict('Username already taken');
  }

  // Create user
  const user = await User.create(userData);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  // Generate JWT tokens
  const tokens = generateTokens(user._id.toString());

  // Remove password from response
  const userObject = user.toObject();
  delete (userObject as any).password;

  return {
    user: userObject,
    tokens,
    verificationToken
  };
};

/**
 * Login user
 */
export const loginUser = async (email: string, password: string) => {
  // Find user with password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw ApiError.forbidden('Account has been deactivated');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT tokens
  const tokens = generateTokens(user._id.toString());

  // Remove password from response
  const userObject = user.toObject();
  delete (userObject as any).password;

  return {
    user: userObject,
    tokens
  };
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string) => {
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    throw ApiError.badRequest('Invalid verification token');
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return user;
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists
    return { message: 'If email exists, reset link has been sent' };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Send password reset email
  try {
    await emailService.sendPasswordResetEmail(email, user.fullName, resetToken);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // Don't throw - the token is still valid
  }

  return { resetToken, message: 'Password reset email sent' };
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return user;
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  const userId = verifyRefreshToken(refreshToken);

  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or inactive');
  }

  const tokens = generateTokens(userId);

  return tokens;
};
