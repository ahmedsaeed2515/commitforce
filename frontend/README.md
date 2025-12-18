# CommitForce Frontend

Modern, professional frontend for the CommitForce platform built with Next.js 14, TypeScript, and TailwindCSS.

## 🎨 Features

✅ **Phase 1 - MVP** (COMPLETED)

- Authentication Pages (Login, Register)
- Dashboard with User Stats
- Modern Landing Page
- JWT Token Management
- Form Validation (Zod + React Hook Form)
- State Management (Zustand)
- Responsive Design

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **API Client**: Axios
- **Server State**: TanStack Query (React Query)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (pages)/
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Registration page
│   │   │   └── dashboard/     # User dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   │
│   ├── components/            # React components
│   │   └── StoreHydration.tsx # Zustand hydration
│   │
│   ├── lib/                   # Core library
│   │   ├── api/              # API client & endpoints
│   │   ├── store/            # Zustand stores
│   │   ├── validations/      # Zod schemas
│   │   └── utils/            # Utility functions
│   │
│   └── styles/
│       └── globals.css       # Global styles
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📄 Available Pages

| Route        | Description       | Protected |
| ------------ | ----------------- | --------- |
| `/`          | Landing page      | No        |
| `/login`     | User login        | No        |
| `/register`  | User registration | No        |
| `/dashboard` | User dashboard    | Yes       |

## 📄 License

ISC
