import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY: string;
  JWT_REFRESH_EXPIRY: string;
  JWT_SECRET: string; // Alias for JWT_ACCESS_SECRET
  
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  FROM_EMAIL?: string;
  FROM_NAME?: string;
  
  FRONTEND_URL: string;
  
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  
  REDIS_URL?: string;
  
  // VAPID keys for Push Notifications
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key] || defaultValue;
  if (!value && !defaultValue) {
    console.warn(`⚠️  Warning: Environment variable ${key} is not set`);
  }
  return value;
};

const config: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  MONGODB_URI: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/commitforce'),
  
  JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET', 'dev_access_secret_change_in_production'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_in_production'),
  JWT_ACCESS_EXPIRY: getEnvVar('JWT_ACCESS_EXPIRY', '15m'),
  JWT_REFRESH_EXPIRY: getEnvVar('JWT_REFRESH_EXPIRY', '7d'),
  JWT_SECRET: getEnvVar('JWT_ACCESS_SECRET', 'dev_access_secret_change_in_production'), // Alias
  
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: parseInt(getEnvVar('SMTP_PORT', '587'), 10),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASS: getEnvVar('SMTP_PASS'),
  FROM_EMAIL: getEnvVar('FROM_EMAIL', 'noreply@commitforce.com'),
  FROM_NAME: getEnvVar('FROM_NAME', 'CommitForce'),
  
  FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
  
  CLOUDINARY_CLOUD_NAME: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),
  
  STRIPE_SECRET_KEY: getEnvVar('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  
  REDIS_URL: getEnvVar('REDIS_URL'),
  
  // VAPID keys for Push Notifications
  VAPID_PUBLIC_KEY: getEnvVar('VAPID_PUBLIC_KEY'),
  VAPID_PRIVATE_KEY: getEnvVar('VAPID_PRIVATE_KEY'),
  VAPID_SUBJECT: getEnvVar('VAPID_SUBJECT', 'mailto:admin@commitforce.com'),
};

// Validate critical environment variables
const validateConfig = () => {
  const requiredVars = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0 && config.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateConfig();

export default config;
