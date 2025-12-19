import nodemailer from 'nodemailer';
import config from '../config/env';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: config.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(config.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

/**
 * Send email
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"CommitForce" <${config.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to CommitForce!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name}! 👋</h2>
          <p>Welcome to CommitForce - the platform where commitments become achievements!</p>
          <p>We're excited to have you join our community of goal-achievers.</p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>✅ Create your first challenge</li>
            <li>✅ Join a club</li>
            <li>✅ Start your streak</li>
            <li>✅ Earn badges and rewards</li>
          </ul>
          
          <a href="${config.FRONTEND_URL}/dashboard" class="button">Get Started</a>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Let's achieve great things together! 💪</p>
        </div>
        <div class="footer">
          <p>© 2025 CommitForce. All rights reserved.</p>
          <p>You received this email because you signed up for CommitForce.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Welcome to CommitForce! 🎉', html);
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password for your CommitForce account.</p>
          <p>Click the button below to reset your password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="background: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
          
          <p>If you have any questions, contact our support team.</p>
        </div>
        <div class="footer">
          <p>© 2025 CommitForce. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Reset Your Password - CommitForce', html);
};

/**
 * Send challenge reminder email
 */
export const sendChallengeReminderEmail = async (
  email: string,
  name: string,
  challengeTitle: string,
  daysLeft: number
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .highlight { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Challenge Reminder</h1>
        </div>
        <div class="content">
          <h2>Hi ${name}! 👋</h2>
          <p>This is a friendly reminder about your challenge:</p>
          
          <div class="highlight">
            <h3>📌 ${challengeTitle}</h3>
            <p><strong>${daysLeft} days remaining</strong></p>
          </div>
          
          <p>Keep up the great work! Remember:</p>
          <ul>
            <li>✅ Check in daily to maintain your streak</li>
            <li>✅ Stay committed to your goal</li>
            <li>✅ You've got this! 💪</li>
          </ul>
          
          <a href="${config.FRONTEND_URL}/challenges" class="button">View Challenge</a>
          
          <p>Don't let your progress go to waste. Keep pushing forward!</p>
        </div>
        <div class="footer">
          <p>© 2025 CommitForce. All rights reserved.</p>
          <p>You can manage your email preferences in settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, `Reminder: ${challengeTitle} - ${daysLeft} days left`, html);
};

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmationEmail = async (
  email: string,
  name: string,
  amount: number,
  currency: string,
  challengeTitle: string
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Successful!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Your payment has been processed successfully!</p>
          
          <div class="receipt">
            <h3>Payment Receipt</h3>
            <table style="width: 100%; margin-top: 15px;">
              <tr>
                <td><strong>Challenge:</strong></td>
                <td>${challengeTitle}</td>
              </tr>
              <tr>
                <td><strong>Amount:</strong></td>
                <td>${currency} ${amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td style="color: #10b981;"><strong>Paid</strong></td>
              </tr>
            </table>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Your challenge is now active</li>
            <li>Start checking in daily</li>
            <li>Complete the challenge to get your deposit back</li>
          </ul>
          
          <p>Good luck with your challenge! 🚀</p>
        </div>
        <div class="footer">
          <p>© 2025 CommitForce. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Payment Confirmation - CommitForce', html);
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendChallengeReminderEmail,
  sendPaymentConfirmationEmail
};
