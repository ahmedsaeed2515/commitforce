# 🦅 CommitForce - Full Project Documentation

Welcome to the comprehensive documentation for **CommitForce**, the ultimate accountability platform.

---

## 📖 Table of Contents

1. [Project Vision & Overview](#-project-vision--overview)
2. [Current Status & Features](#-current-status--features)
3. [Setup & Installation Guide](#-setup--installation-guide)
4. [Implementation Details](#-implementation-details)
5. [API Reference](#-api-reference)
6. [Testing & Quality Assurance](#-testing--quality-assurance)
7. [Audit & Security Report](#-audit--security-report)
8. [Development Roadmap](#-development-roadmap)
9. [GitHub & Deployment](#-github--deployment)

---

## 🎯 Project Vision & Overview

**CommitForce** is a full-stack accountability platform designed to help users achieve their goals by putting a financial stake on their commitments.

**The Principle**: "Put your money where your goals are." If you succeed, you keep your money; if you fail, it goes to charity.

### Core Values:

- **Accountability**: Real stakes for real results.
- **Verification**: AI-powered and manual proof systems.
- **Gamification**: Streaks, badges, daily quests, and leaderboards.
- **Social Support**: Feed, comments, clubs, and group challenges.

---

## 🟢 Current Status & Features

**Status**: PRODUCTION READY - FULL FEATURED v2.1 (as of Dec 2025)

### ✅ Completed Features

| Feature                | Description                                                   | Version |
| ---------------------- | ------------------------------------------------------------- | ------- |
| **Auth System**        | Secure JWT-based registration and login                       | v1.0    |
| **Challenge Engine**   | Solo, group, and duel challenges with financial pledges       | v1.0    |
| **AI Verification**    | Google Cloud Vision integration for verifying check-in photos | v1.0    |
| **Stripe Integration** | Real-money deposits and prize distribution                    | v1.0    |
| **Gamification**       | 12 badge types, streak tracking, freeze tokens, daily quests  | v2.0    |
| **Social Feed**        | Activity feed with likes and comments                         | v2.0    |
| **Comment System**     | Full CRUD with @mentions and likes                            | v2.1    |
| **Team Clubs**         | Create, join, leave clubs with leaderboards                   | v2.1    |
| **User Discovery**     | Search users, recommended friends                             | v2.1    |
| **Personal Analytics** | Success charts, streak stats, level progression               | v2.1    |
| **WebSocket**          | Real-time notifications for badges and activities             | v2.0    |
| **Responsive UI**      | Next.js 16 based professional dashboard                       | v2.0    |

### 📊 Feature Matrix

| Feature             | Status | Technology          |
| :------------------ | :----- | :------------------ |
| **Solo Challenges** | ✅     | Node.js/Mongoose    |
| **Group Duels**     | ✅     | Node.js/Cron        |
| **Team Clubs**      | ✅     | MongoDB/Socket.IO   |
| **AI Proofing**     | ✅     | Google Vision API   |
| **Payments**        | ✅     | Stripe SDK          |
| **Real-time**       | ✅     | Socket.IO           |
| **Comments**        | ✅     | MongoDB/REST API    |
| **Daily Quests**    | ✅     | Node.js/Scheduler   |
| **Analytics**       | ✅     | React/Charts        |
| **Testing**         | ✅     | Vitest / Playwright |

---

## 🚀 Setup & Installation Guide

### Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Stripe Account (Test keys)
- Google Cloud Vision API key (Optional)

### 1. Clone & Install

```bash
git clone https://github.com/ahmedsaeed2515/commitforce.git
cd commitforce
npm run install:all
```

### 2. Environment Configuration

Create `.env` in `backend/`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/commitforce
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
FRONTEND_URL=http://localhost:3000
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Development

```bash
# Root directory - runs both backend and frontend
npm run dev
```

---

## 🛠 Implementation Details

### Backend Architecture (Node.js + TypeScript)

```
backend/
├── src/
│   ├── config/         # Database, Socket.IO, Environment
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, Error, Upload
│   ├── models/         # MongoDB schemas
│   │   ├── User.model.ts
│   │   ├── Challenge.model.ts
│   │   ├── CheckIn.model.ts
│   │   ├── Comment.model.ts      # NEW
│   │   ├── Club.model.ts         # NEW
│   │   ├── DailyQuest.model.ts   # NEW
│   │   ├── Badge.model.ts
│   │   └── ...
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   │   ├── gamification.service.ts
│   │   ├── comment.service.ts    # NEW
│   │   ├── club.service.ts       # NEW
│   │   ├── dailyQuest.service.ts # NEW
│   │   └── ...
│   └── utils/          # Helpers
└── tests/              # Unit tests
```

### Frontend Architecture (Next.js 16)

```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── dashboard/
│   │   ├── challenges/
│   │   ├── clubs/              # NEW
│   │   ├── users/              # NEW
│   │   ├── analytics/          # NEW
│   │   └── ...
│   ├── components/             # Reusable components
│   │   ├── CommentSection.tsx  # NEW
│   │   ├── DailyQuestsWidget.tsx # NEW
│   │   └── ...
│   └── lib/
│       ├── api/                # API clients
│       ├── store/              # Zustand stores
│       └── socket.ts           # WebSocket client
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/register` | Register new user |
| POST   | `/api/v1/auth/login`    | Login user        |
| GET    | `/api/v1/auth/me`       | Get current user  |

### Challenges

| Method | Endpoint                          | Description             |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/api/v1/challenges`              | Get all user challenges |
| POST   | `/api/v1/challenges`              | Create new challenge    |
| GET    | `/api/v1/challenges/:id`          | Get challenge details   |
| POST   | `/api/v1/challenges/:id/check-in` | Submit check-in         |

### Social (NEW)

| Method | Endpoint                                | Description         |
| ------ | --------------------------------------- | ------------------- |
| GET    | `/api/v1/social/check-ins/:id/comments` | Get comments        |
| POST   | `/api/v1/social/check-ins/:id/comments` | Add comment         |
| POST   | `/api/v1/social/comments/:id/like`      | Like/unlike comment |
| DELETE | `/api/v1/social/comments/:id`           | Delete comment      |

### Clubs (NEW)

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| GET    | `/api/v1/clubs/search`      | Search clubs     |
| POST   | `/api/v1/clubs`             | Create club      |
| GET    | `/api/v1/clubs/:id`         | Get club details |
| POST   | `/api/v1/clubs/:id/join`    | Join club        |
| POST   | `/api/v1/clubs/:id/leave`   | Leave club       |
| GET    | `/api/v1/clubs/leaderboard` | Club rankings    |

### Daily Quests (NEW)

| Method | Endpoint                            | Description        |
| ------ | ----------------------------------- | ------------------ |
| GET    | `/api/v1/daily-quests`              | Get today's quests |
| GET    | `/api/v1/daily-quests/descriptions` | Quest types info   |

### Users (NEW)

| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| GET    | `/api/v1/users/search`              | Search users           |
| GET    | `/api/v1/users/:username`           | Get user profile       |
| GET    | `/api/v1/users/friends/recommended` | Get friend suggestions |

---

## 🧪 Testing & Quality Assurance

We maintain high standards through multi-layered testing.

### Running Tests

```bash
# Unit Tests (Backend)
cd backend && npm test

# E2E Tests (Frontend)
cd frontend && npx playwright test

# Coverage Report
npm run test:coverage
```

### What is tested?

- **Authentication**: Registration, Login, Protected routes
- **Gamification**: Streak logic, Badge awarding, Freeze tokens
- **Challenge Life-cycle**: Creation → Check-in → Completion
- **Comments**: CRUD operations, @mentions
- **Clubs**: Create, Join, Leave

---

## 🔍 Audit & Security Report

CommitForce underwent a comprehensive audit on Dec 18, 2025.

### Results:

- **Score**: 98/100 🏆
- **Critical Issues**: 0
- **Security**: JWT tokens, Password hashing, Stripe secure sessions
- **Reliability**: Automated cron jobs for fund distribution

### Security Features:

- ✅ JWT with refresh tokens
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting on auth routes
- ✅ Input validation & sanitization
- ✅ Stripe secure webhooks
- ✅ CORS configuration

---

## 🗺 Development Roadmap

See [FUTURE_PLAN.md](./FUTURE_PLAN.md) for detailed roadmap.

### Completed (v2.0 - v2.1)

- [x] Comment System with @mentions
- [x] Daily Quests gamification
- [x] Team Clubs with leaderboards
- [x] User Discovery & Search
- [x] Personal Analytics Dashboard
- [x] Advanced Badges (Diamond, Eternal, etc.)

### Coming Next (v2.2)

- [ ] Mobile-responsive design improvements
- [ ] Friends system (follow/unfollow)
- [ ] Redis caching for performance
- [ ] Dark mode support

---

## 📤 GitHub & Deployment

### Repository

```bash
git remote add origin https://github.com/ahmedsaeed2515/commitforce.git
git branch -M main
git push -u origin main
```

### Production Deployment

| Service      | Platform         | Notes              |
| ------------ | ---------------- | ------------------ |
| **Backend**  | Render / Railway | Auto-scales        |
| **Frontend** | Vercel           | Edge functions     |
| **Database** | MongoDB Atlas    | M10+ recommended   |
| **Files**    | Cloudinary       | Image optimization |
| **Payments** | Stripe           | Live mode ready    |

### Environment Variables (Production)

Remember to set all `.env` variables in your hosting platform's dashboard.

---

## 📞 Support & Contributing

- **Issues**: Create a GitHub issue
- **Pull Requests**: Fork and submit PRs
- **Documentation**: This file + inline comments

---

**Developed with ❤️ by the CommitForce Team**  
**Version**: 2.1.0 | **Last Updated**: December 18, 2025
