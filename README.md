# 🎯 CommitForce - Professional Challenge Commitment Platform

**"Put Your Money Where Your Goals Are"**

Enterprise-grade full-stack platform where users commit to challenges with financial stakes. Complete your goals and earn rewards, or donate to charity if you don't succeed.

## 📊 Current Status: **Phase 1 - MVP Core** ✅

### ✅ Completed Features

- Backend Express.js + TypeScript server
- JWT Authentication (Access + Refresh Tokens)
- User Registration & Login
- MongoDB Integration
- Error Handling & Security
- Next.js 14 Frontend Setup

### 🚧 In Progress

- Frontend Authentication Pages
- Challenge Creation UI
- Dashboard

## 🏗️ Project Structure

```
commitforce/
├── backend/              # Express.js + TypeScript API
│   ├── src/
│   │   ├── config/      # Database, environment
│   │   ├── models/      # Mongoose models
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Auth, validation, errors
│   │   ├── routes/      # API endpoints
│   │   └── utils/       # Helper functions
│   └── README.md
│
└── frontend/            # Next.js 14 + TypeScript
    ├── src/
    │   ├── app/         # App Router pages
    │   ├── components/  # React components
    │   ├── lib/         # API client, hooks, stores
    │   └── styles/      # Global styles
    └── README.md (coming soon)
```

## 🚀 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken)
- **Security**: Helmet, bcryptjs, CORS
- **Validation**: express-validator

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

### Future Integrations

- **Payment**: Stripe SDK
- **Storage**: Cloudinary / AWS S3
- **Real-time**: Socket.io
- **Caching**: Redis
- **Email**: Nodemailer

## 🎯 Implementation Phases

### ✅ Phase 1: Foundation & MVP Core (COMPLETED)

- [x] Backend setup with TypeScript
- [x] MongoDB models (User, Challenge, CheckIn)
- [x] JWT Authentication
- [x] User registration/login
- [x] Next.js frontend setup
- [x] Project structure

### 🔄 Phase 2: Challenge System (IN PROGRESS)

- [ ] Challenge CRUD endpoints
- [ ] Challenge creation UI
- [ ] Progress tracking
- [ ] Check-in functionality
- [ ] Browse/filter challenges

### 📅 Phase 3: Financial Integration

- [ ] Stripe payment integration
- [ ] Deposit flow
- [ ] Refund/reward logic
- [ ] Transaction history

### 📅 Phase 4: Social Features

- [ ] Follow/unfollow system
- [ ] Community feed
- [ ] Comments & likes
- [ ] Real-time notifications

### 📅 Phase 5: Charity System

- [ ] Charity selection
- [ ] Donation processing
- [ ] Impact tracking

### 📅 Phase 6: Gamification

- [ ] Badge system
- [ ] Leaderboard
- [ ] Achievement notifications
- [ ] Analytics dashboard

### 📅 Phase 7: Polish & Production

- [ ] Animations
- [ ] SEO optimization
- [ ] Performance tuning
- [ ] Security hardening

### 📅 Phase 8: Deployment

- [ ] Backend to Railway/Render
- [ ] Frontend to Vercel
- [ ] MongoDB Atlas
- [ ] CI/CD pipeline

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

**Base URL**: `http://localhost:5000/api/v1`

#### Register User

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "johndoe",
  "fullName": "John Doe"
}
```

#### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User

```bash
GET /auth/me
Authorization: Bearer <access_token>
```

Full API documentation available in `backend/README.md`

## 🔐 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT access & refresh tokens
- CORS protection
- Helmet security headers
- Input validation
- Rate limiting (coming soon)
- Email verification
- Password reset with expiring tokens

## 📁 Database Models

### User

- Authentication & profile
- Statistics (success rate, challenges)
- Financial data (deposits, earnings)
- Social features (followers/following)
- Preferences & settings

### Challenge

- Goal tracking (numeric/boolean/milestone)
- Financial details (deposit, reward)
- Charity selection
- Check-in requirements
- Verification settings
- Social features (public/private, comments)

### CheckIn

- Progress updates
- Photo/measurement proofs
- Verification status
- Engagement (likes, comments)

## 🌟 Key Features

### For Users

- **Financial Commitment**: Put money on your goals
- **Flexible Goals**: Numeric targets, habits, or milestones
- **Progress Tracking**: Regular check-ins with proof
- **Social Support**: Share journey, get accountability partners
- **Charity Impact**: Failed challenges support good causes
- **Achievement System**: Earn badges, climb leaderboards

### For Platform

- **Verification**: Manual, automated, or partner-based
- **Payment Processing**: Secure Stripe integration
- **Real-time Updates**: Live progress & notifications
- **Analytics**: Success predictions, insights
- **Scalable**: Enterprise-grade architecture

## 🎨 Design Principles

- **Premium UI**: Modern, polished interface
- **Responsive**: Mobile-first design
- **Accessible**: WCAG compliance
- **Fast**: Optimized performance
- **Secure**: Industry-standard security

## 📝 Development Workflow

1. **Feature Branch**: Create from `main`
2. **Development**: Build & test locally
3. **Testing**: Unit & integration tests
4. **Documentation**: Update README & comments
5. **Pull Request**: Review & merge
6. **Deploy**: Automated CI/CD

## 🤝 Contributing

This is an active development project. Each phase builds upon the previous one.

## 📄 License

ISC

---

**Built with ❤️ for people who commit to their goals**
