import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import connectDB from './config/database';
import config from './config/env';
import { initializeSocket } from './config/socket';
import errorHandler from './middleware/error.middleware';

// Routes imports
import authRoutes from './routes/auth.routes';
import challengeRoutes from './routes/challenge.routes';
// checkInRoutes is nested in challengeRoutes
import clubRoutes from './routes/club.routes';
import commentRoutes from './routes/comment.routes';
import dailyQuestRoutes from './routes/dailyQuest.routes';
import feedRoutes from './routes/feed.routes';
import gamificationRoutes from './routes/gamification.routes';
import groupChallengeRoutes from './routes/groupChallenge.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import notificationRoutes from './routes/notification.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';
import verificationRoutes from './routes/verification.routes';
import pushRoutes from './routes/push.routes';

const app = express();
const httpServer = createServer(app);

// Connect Database
connectDB();

// Middleware
app.use(cors({ 
    origin: config.FRONTEND_URL, 
    credentials: true 
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO
initializeSocket(httpServer);

// Routes Mounting
app.use('/api/v1/auth', authRoutes);

// Challenge Routes (Order matters: Group routes before generic challenge routes)
app.use('/api/v1/challenges', groupChallengeRoutes);
app.use('/api/v1/challenges', challengeRoutes);

app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/daily-quests', dailyQuestRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/verifications', verificationRoutes);
app.use('/api/v1/push', pushRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.send('CommitForce API is running');
});

// Error Handler
app.use(errorHandler);

// Start Server
httpServer.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
