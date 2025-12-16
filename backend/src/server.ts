import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database';
import config from './config/env';
import errorHandler from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';

// Create Express app
const app: Application = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'CommitForce API is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// API routes
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/auth`, authRoutes);

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

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${config.NODE_ENV}`);
  console.log(`✅ Frontend URL: ${config.FRONTEND_URL}`);
  console.log('🚀 ========================================');
  console.log('');
});

export default app;
