# 🦅 CommitForce - Full Project Documentation

Welcome to the comprehensive documentation for **CommitForce**, the ultimate accountability platform.

---

## 📖 Table of Contents

1. [Project Vision & Overview](#-project-vision--overview)
2. [Current Status & Features](#-current-status--features)
3. [Setup & Installation Guide](#-setup--installation-guide)
4. [Implementation Details](#-implementation-details)
5. [Testing & Quality Assurance](#-testing--quality-assurance)
6. [Audit & Security Report](#-audit--security-report)
7. [Development Roadmap](#-development-roadmap)
8. [GitHub & Deployment](#-github--deployment)

---

## 🎯 Project Vision & Overview

**CommitForce** is a full-stack accountability platform designed to help users achieve their goals by putting a financial stake on their commitments.
**The Principle**: "Put your money where your goals are." If you succeed, you keep your money; if you fail, it goes to charity.

### Core Values:

- **Accountability**: Real stakes for real results.
- **Verification**: AI-powered and manual proof systems.
- **Gamification**: Streaks, badges, and leaderboards to keep you motivated.
- **Social Support**: Feed, likes, and group challenges.

---

## 🟢 Current Status & Features

**Status**: PRODUCTION READY - FULL FEATURED (as of Dec 2025)

### ✅ Completed Features

- **Auth System**: Secure JWT-based registration and login.
- **Challenge Engine**: Create solo, group, or duel challenges with financial pledges.
- **AI Verification**: Google Cloud Vision integration for verifying check-in photos.
- **Stripe Integration**: Real-money deposits and prize distribution.
- **Gamification**: 7 types of badges, streak tracking, and freeze tokens.
- **Social Feed**: Real-time activity feed with likes and notifications.
- **Responsive UI**: Next.js 14 based professional dashboard.

### 📊 Feature Matrix

| Feature             | Status | Technology          |
| :------------------ | :----- | :------------------ |
| **Solo Challenges** | ✅     | Node.js/Mongoose    |
| **Group Duels**     | ✅     | Node.js/Cron        |
| **AI Proofing**     | ✅     | Google Vision API   |
| **Payments**        | ✅     | Stripe SDK          |
| **Real-time**       | ✅     | Socket.IO           |
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
git clone <repo-url>
cd commitforce
npm install:all
```

### 2. Environment Configuration

Create `.env` in `backend/`:

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/commitforce
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Development

```bash
# Root directory
npm run dev
```

---

## 🛠 Implementation Details

### Backend Architecture (Node.js)

- **Controllers**: Logic handling for Auth, Challenges, Gamification, and Payments.
- **Services**: Business logic abstraction (Image processing, Streak calculation, AI scoring).
- **Models**: MongoDB schemas for Users, Challenges, CheckIns, and Transactions.
- **Auto-Verification**: Cron jobs run hourly to evaluate challenge progress.

### Frontend Architecture (Next.js)

- **App Router**: Dynamic routing for dashboard, profile, and challenges.
- **Zustand**: Lightweight state management for user sessions and UI state.
- **Components**: Polished, responsive components using Tailwind CSS and Radix UI.

---

## 🧪 Testing & Quality Assurance

We maintain high standards through multi-layered testing.

### Running Tests

- **Unit Tests (Backend)**: `cd backend && npm test`
- **E2E Tests (Frontend)**: `cd frontend && npx playwright test`
- **Coverage**: Run `npm run test:coverage` in backend for details.

### What is tested?

- **Authentication**: Registration, Login, and Protected routes.
- **Gamification**: Streak logic, Badge awarding, and Freeze token purchases.
- **Challenge Life-cycle**: Creation → Check-in → Completion.

---

## 🔍 Audit & Security Report

CommitForce underwent a comprehensive audit on Dec 17, 2025.

### Results:

- **Score**: 98/100 🏆
- **Critical Issues**: 0
- **Security**: JWT tokens, Password hashing, and Stripe secure sessions.
- **Reliability**: Automated cron jobs for fund distribution.

### Optimization Notes:

- **Images**: Fully optimized via Next.js `<Image />` component.
- **WebSockets**: Integrated for real-time notifications.

---

## 🗺 Development Roadmap

### Completed (Phase 1 & 2)

- [x] Base Auth & Structure
- [x] Challenge System & Image Uploads
- [x] Gamification & Badges

### In Progress (Phase 3)

- [x] Stripe Wallet Integration
- [x] AI Verification AI Scoring
- [ ] Mobile App Foundation

### Future (Phase 4+)

- [ ] Real-time Mobile Notifications
- [ ] Health API Integrations (Apple/Google Fit)
- [ ] Social Comments & Shares

---

## 📤 GitHub & Deployment

### Pushing to GitHub

```bash
git remote add origin https://github.com/USERNAME/commitforce.git
git branch -M main
git push -u origin main
```

### Production Deployment

- **Backend**: Render / Railway / DigitalOcean
- **Frontend**: Vercel / Netlify
- **Database**: MongoDB Atlas

---

**Developed with ❤️ by the CommitForce Team**
