# CommitForce Backend

Enterprise-grade REST API for the CommitForce platform built with Express.js, TypeScript, and MongoDB.

## Features

✅ **Phase 1 - MVP Core** (COMPLETED)

- JWT Authentication (Access + Refresh Tokens)
- User Registration & Login
- Email Verification
- Password Reset
- Protected Routes with Middleware
- MongoDB Integration
- Error Handling
- TypeScript Support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, bcryptjs, CORS
- **Validation**: express-validator
- **Dev Tools**: nodemon, ts-node

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, env)
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── validators/      # Input validation
│   └── server.ts        # Main server file
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Setup environment variables:

```bash
# Copy .env.example to .env
# Update the values with your configuration
```

3. Start MongoDB:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string
```

4. Run development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint                 | Description            | Access  |
| ------ | ------------------------ | ---------------------- | ------- |
| POST   | `/register`              | Register new user      | Public  |
| POST   | `/login`                 | Login user             | Public  |
| GET    | `/me`                    | Get current user       | Private |
| GET    | `/verify-email/:token`   | Verify email           | Public  |
| POST   | `/forgot-password`       | Request password reset | Public  |
| POST   | `/reset-password/:token` | Reset password         | Public  |
| POST   | `/refresh-token`         | Refresh access token   | Public  |
| POST   | `/logout`                | Logout user            | Private |

### Health Check

```bash
GET /health
```

Response:

```json
{
  "success": true,
  "message": "CommitForce API is running",
  "timestamp": "2025-12-16T20:00:00.000Z",
  "environment": "development"
}
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/commitforce

# JWT Secrets
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
```

## Database Models

### User Model

- Authentication & Profile Info
- Stats (challenges, success rate)
- Financial Data
- Social Features (followers/following)
- Settings & Preferences

### Challenge Model (Coming Soon)

- Goal details & tracking
- Financial integration
- Check-in management
- Verification system

### CheckIn Model (Coming Soon)

- Progress tracking
- Photo/measurement proofs
- Verification status

## Next Steps

### Phase 2 - Challenge System

- [ ] Create Challenge CRUD endpoints
- [ ] Implement check-in functionality
- [ ] Add progress tracking
- [ ] Challenge verification logic

### Phase 3 - Financial Integration

- [ ] Stripe integration
- [ ] Payment processing
- [ ] Transaction management
- [ ] Refund/reward logic

## Development

### MongoDB Setup

**Option 1: Local MongoDB**

```bash
# Install MongoDB
# Start MongoDB service
mongod

# Database will be created automatically
```

**Option 2: MongoDB Atlas (Recommended)**

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","username":"testuser","fullName":"Test User"}'

# Test login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- CORS protection
- Helmet security headers
- Input validation
- Protected routes middleware
- Email verification
- Password reset with expiring tokens

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Contributing

This is Phase 1 of the CommitForce backend. More features coming soon!

## License

ISC
