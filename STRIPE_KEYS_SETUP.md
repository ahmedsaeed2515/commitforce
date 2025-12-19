# 🔑 مفاتيح Stripe - تعليمات الإعداد

## ⚠️ مهم جداً!

هذا الملف يحتوي على **أمثلة** للمفاتيح فقط.
يجب عليك استبدالها بمفاتيحك الحقيقية من Stripe Dashboard.

---

## 📝 كيفية الحصول على المفاتيح:

### 1. سجل في Stripe:

```
https://dashboard.stripe.com/register
```

### 2. اذهب إلى API Keys:

```
https://dashboard.stripe.com/test/apikeys
```

### 3. انسخ المفاتيح:

- **Publishable key** (يبدأ بـ `pk_test_`)
- **Secret key** (يبدأ بـ `sk_test_`)

---

## 🔧 Backend Setup

### ملف: `backend/.env`

انسخ المحتوى التالي وعدّل المفاتيح:

```env
# ============================================
# STRIPE CONFIGURATION
# ============================================
# احصل على هذه المفاتيح من: https://dashboard.stripe.com/test/apikeys

# Secret Key (للـ Backend فقط - لا تشاركه أبداً!)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Webhook Secret (اختياري للتطوير - مطلوب للـ Production)
# احصل عليه من: https://dashboard.stripe.com/test/webhooks
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# ============================================
# DATABASE
# ============================================
MONGODB_URI=mongodb://localhost:27017/commitforce

# ============================================
# JWT SECRETS
# ============================================
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_this_in_production

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# FRONTEND URL
# ============================================
FRONTEND_URL=http://localhost:3000

# ============================================
# REDIS (Optional - for caching)
# ============================================
REDIS_URL=redis://localhost:6379
```

---

## 🎨 Frontend Setup

### ملف: `frontend/.env.local`

انسخ المحتوى التالي وعدّل المفتاح:

```env
# ============================================
# API CONFIGURATION
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# ============================================
# STRIPE CONFIGURATION
# ============================================
# Publishable Key (آمن للاستخدام في Frontend)
# احصل عليه من: https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

---

## ✅ التحقق من التثبيت

### 1. تحقق من وجود الملفات:

```bash
# Backend
d:\projects\project\backend\.env

# Frontend
d:\projects\project\frontend\.env.local
```

### 2. تحقق من المفاتيح:

```bash
# Backend - يجب أن يبدأ بـ sk_test_
STRIPE_SECRET_KEY=sk_test_51...

# Frontend - يجب أن يبدأ بـ pk_test_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

### 3. أعد تشغيل الخوادم:

```bash
# أوقف الخوادم (Ctrl+C)
# ثم شغّلها مرة أخرى

# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## 🧪 اختبار النظام

### استخدم بطاقة اختبار Stripe:

```
Card Number: 4242 4242 4242 4242
Expiry Date: 12/34 (أي تاريخ مستقبلي)
CVC: 123 (أي 3 أرقام)
ZIP Code: 12345 (أي 5 أرقام)
```

### بطاقات اختبار أخرى:

**فشل الدفع:**

```
Card: 4000 0000 0000 0002
```

**يتطلب 3D Secure:**

```
Card: 4000 0027 6000 3184
```

**رصيد غير كافٍ:**

```
Card: 4000 0000 0000 9995
```

---

## 🔒 ملاحظات أمنية

### ⚠️ لا تفعل:

- ❌ لا تشارك `STRIPE_SECRET_KEY` مع أحد
- ❌ لا تضعه في Frontend
- ❌ لا ترفعه على GitHub (موجود في .gitignore)
- ❌ لا تستخدم مفاتيح Production في التطوير

### ✅ افعل:

- ✅ استخدم مفاتيح Test (تبدأ بـ `_test_`)
- ✅ احفظ المفاتيح في ملفات `.env`
- ✅ غيّر المفاتيح إذا تم تسريبها
- ✅ استخدم متغيرات البيئة في Production

---

## 📚 مراجع إضافية

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Payment System Guide](./PAYMENT_SYSTEM_GUIDE.md)
- [Stripe Setup Guide](./STRIPE_SETUP_GUIDE.md)

---

## 🆘 المساعدة

إذا واجهت مشاكل:

1. تأكد من نسخ المفاتيح كاملة (بدون مسافات)
2. تأكد من استخدام مفاتيح Test
3. أعد تشغيل الخوادم بعد التعديل
4. راجع console للأخطاء
5. راجع Stripe Dashboard → Logs

---

**تاريخ التحديث:** 2025-12-19  
**الحالة:** ✅ جاهز للاستخدام
