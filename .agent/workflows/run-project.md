---
description: كيفية تشغيل مشروع CommitForce
---

# تشغيل مشروع CommitForce

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

- Node.js (v18 أو أحدث)
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

## الخطوة 1: تثبيت Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## الخطوة 2: إعداد ملفات البيئة

### Backend (.env)

تأكد من وجود ملف `.env` في مجلد `backend` بالتكوينات التالية:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/commitforce
JWT_ACCESS_SECRET=commitforce_access_secret_key_development_2025
JWT_REFRESH_SECRET=commitforce_refresh_secret_key_development_2025
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=http://localhost:3000
```

إذا لم يكن موجودًا، يمكنك نسخه من `.env.example`:

```bash
cd backend
Copy-Item .env.example .env
```

### Frontend (.env.local)

تأكد من وجود ملف `.env.local` في مجلد `frontend` بالتكوين التالي:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## الخطوة 3: تشغيل MongoDB

### MongoDB المحلي

```bash
mongod
```

### MongoDB Atlas

- استخدم connection string من MongoDB Atlas
- حدث `MONGODB_URI` في ملف `.env`

## الخطوة 4: تشغيل Backend

```bash
cd backend
npm run dev
```

سيعمل الـ Backend على: `http://localhost:5000`

## الخطوة 5: تشغيل Frontend

في terminal جديد:

```bash
cd frontend
npm run dev
```

سيعمل الـ Frontend على: `http://localhost:3000`

## الخطوة 6: اختبار التطبيق

1. افتح المتصفح على `http://localhost:3000`
2. سترى الصفحة الرئيسية للتطبيق
3. يمكنك التسجيل من خلال صفحة `/register`
4. تسجيل الدخول من خلال صفحة `/login`
5. الوصول إلى لوحة التحكم من خلال `/dashboard`

## استكشاف الأخطاء

### MongoDB Connection Error

إذا ظهرت رسالة خطأ في الاتصال بـ MongoDB:

- تأكد من تشغيل MongoDB
- تحقق من `MONGODB_URI` في ملف `.env`
- جرب استخدام MongoDB Atlas بدلاً من MongoDB المحلي

### Port Already in Use

إذا كان Port 5000 أو 3000 مستخدم:

- غير `PORT` في `backend/.env`
- غير Port في terminal أو استخدم `PORT=3001 npm run dev` للـ frontend

## أوامر مفيدة

### Build للإنتاج

Backend:

```bash
cd backend
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run build
npm start
```

### Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```
