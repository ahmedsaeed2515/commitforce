import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import * as authService from '../services/auth.service';

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username, fullName } = req.body;

  const result = await authService.registerUser({
    email,
    password,
    username,
    fullName
  });

  // TODO: Send verification email in production
  // await sendVerificationEmail(result.user.email, result.verificationToken);

  res.status(201).json(
    ApiResponse.created('User registered successfully', {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    })
  );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  res.status(200).json(
    ApiResponse.success('Login successful', {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    })
  );
});

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(
    ApiResponse.success('User fetched successfully', req.user)
  );
});

/**
 * @desc    Verify email
 * @route   GET /api/v1/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  await authService.verifyEmail(token);

  res.status(200).json(
    ApiResponse.success('Email verified successfully', { emailVerified: true })
  );
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  // TODO: Send reset email in production
  // await sendResetEmail(email, result.resetToken);

  res.status(200).json(
    ApiResponse.success('Password reset link sent to email')
  );
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  await authService.resetPassword(token, password);

  res.status(200).json(
    ApiResponse.success('Password reset successful')
  );
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const tokens = await authService.refreshAccessToken(refreshToken);

  res.status(200).json(
    ApiResponse.success('Token refreshed successfully', tokens)
  );
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // In a stateless JWT system, logout is handled client-side by removing tokens
  // In production, you might want to blacklist tokens using Redis

  res.status(200).json(
    ApiResponse.success('Logout successful')
  );
});
