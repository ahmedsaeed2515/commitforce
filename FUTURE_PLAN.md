# 🚀 CommitForce: Future Roadmap & Improvement Plan

This document outlines the planned improvements, bug fixes, and new features for the CommitForce platform.

---

## 🛠 1. Immediate Bug Fixes & Technical Debt

_Goal: Resolve existing minor issues and optimize code quality._

- [ ] **Frontend WebSocket Integration**:
  - Connect the client-side socket in `frontend/src/lib/socket.ts`.
  - Implement real-time toast notifications for badges and streak updates.
- [ ] **Image Component Migration**:
  - Replace remaining `<img>` tags with Next.js `<Image />` component in:
    - `Navbar.tsx`
    - `feed/page.tsx`
    - `leaderboard/page.tsx`
    - `profile/page.tsx`
- [ ] **CSS & Linting**:
  - Fix Tailwind CSS lint warnings (e.g., `bg-gradient-to-r` → `bg-linear-to-r`).
  - Standardize icon sizes across the dashboard.
- [ ] **Error Handling**:
  - Add more descriptive error messages for Stripe payment failures.
  - Implement a global "Maintenance Mode" toggle for the admin.

---

## ✨ 2. New Features (Social & Community)

_Goal: increase user engagement and retention._

- [ ] **Comment System**:
  - Allow users to comment on activity feed items.
  - Add @mention support for users.
- [ ] **Expanded Social Feed**:
  - Add "Friends Only" vs "Global" feed toggle.
  - Allow sharing challenges to external social media (Twitter, WhatsApp).
- [ ] **User Discovery**:
  - Implement a "Search Users" feature.
  - Add "Recommended Friends" based on similar challenge categories.

---

## 🎮 3. Enhanced Gamification

_Goal: Make the platform more addictive and rewarding._

- [ ] **Daily Quests**:
  - Add small daily tasks (e.g., "Like 3 posts", "Read a challenge detail") for extra points.
- [ ] **Advanced Badge Tiers**:
  - Introduce "Diamond" and "Eternal" badges for 365+ day streaks.
- [ ] **Team Challenges**:
  - Allow users to form "Clubs" and compete against other clubs for a shared prize pool.

---

## 📈 4. Advanced Analytics & AI

_Goal: Provide deeper insights and smarter verification._

- [ ] **Personal Progress Dashboard**:
  - Add charts using Recharts to show progress over months/years.
  - Calculate "Success Probability" based on past performance.
- [ ] **AI Multi-Modal Verification**:
  - Support video proof for fitness challenges with AI pose detection (e.g., counting pushups).
  - Improved OCR for reading progress on e-readers (Kindle, etc.).

---

## 📱 5. Platform Expansion

_Goal: Reach users where they are._

- [ ] **Mobile App (MVP)**:
  - Develop a React Native or Expo app sharing the existing backend.
  - Focus on "Quick Check-in" and native push notifications.
- [ ] **Browser Extension**:
  - A "CommitForce" sidebar for Chrome/Edge to track coding or productivity challenges.
- [ ] **Wearable Integration**:
  - Sync with Apple Health, Google Fit, and Strava for automatic fitness check-ins.

---

## 🔒 6. Security & Infrastructure

_Goal: Scale reliably and safely._

- [ ] **Two-Factor Authentication (2FA)**:
  - Add email or SMS-based OTP for sensitive account changes.
- [ ] **Admin Panel Pro**:
  - Create a dedicated admin dashboard for managing users, disputes, and charity distributions.
- [ ] **Redis Caching**:
  - Implement Redis for leaderboard and feed caching to improve load times under high traffic.

---

**Last Updated**: 2025-12-18
**Current Version**: v1.1.0-planned
