// CommitForce Server
import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database';
import config from './config/env';
import errorHandler from './middleware/error.middleware';
import { initCronJobs } from './services/cron.service';
import { initializeDefaultBadges } from './services/gamification.service';
import { initializeSocket } from './config/socket';

// Import routes
import authRoutes from './routes/auth.routes';
import challengeRoutes from './routes/challenge.routes';
import verificationRoutes from './routes/verification.routes';
import paymentRoutes from './routes/payment.routes';
import feedRoutes from './routes/feed.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import userRoutes from './routes/user.routes';
import notificationRoutes from './routes/notification.routes';
import groupChallengeRoutes from './routes/groupChallenge.routes';
import gamificationRoutes from './routes/gamification.routes';

// Connect to Database
connectDB();

const app: Application = express();
const httpServer = createServer(app);
const API_VERSION = '/api/v1';

// Initialize WebSocket
try {
    initializeSocket(httpServer);
} catch (error) {
    console.warn('⚠️ WebSocket initialization failed (socket.io not installed)');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/challenges`, challengeRoutes);
app.use(`${API_VERSION}/verification`, verificationRoutes);
app.use(`${API_VERSION}/payments`, paymentRoutes);
app.use(`${API_VERSION}/feed`, feedRoutes);
app.use(`${API_VERSION}/leaderboard`, leaderboardRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/notifications`, notificationRoutes);
app.use(`${API_VERSION}/challenges`, groupChallengeRoutes);
app.use(`${API_VERSION}/gamification`, gamificationRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.PORT || 5000;

// Initialize Cron Jobs
initCronJobs();

// Initialize Default Badges
initializeDefaultBadges();

httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${config.NODE_ENV}`);
  console.log(`✅ Frontend URL: ${config.FRONTEND_URL}`);
  console.log(`🔌 WebSocket: Enabled`);
  console.log('🚀 ========================================');
  console.log('');
});

export default app;
