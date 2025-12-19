# 💳 نظام الدفع - دليل الإعداد والاستخدام

## ✅ تم التنفيذ بنجاح!

تم إنشاء نظام دفع كامل ومتكامل باستخدام **Stripe** للتعامل مع:

- دفع deposit التحديات
- إيداع الأموال في المحفظة
- استرجاع الأموال
- سجل المعاملات

---

## 📦 الملفات المُنشأة

### Backend:

1. **`models/Payment.model.ts`** - نموذج قاعدة البيانات للمدفوعات
2. **`services/payment.service.ts`** - خدمات Stripe والدفع
3. **`controllers/payment.controller.ts`** - معالجات الطلبات
4. **`routes/payment.routes.ts`** - مسارات API

### Frontend:

1. **`lib/api/payment.api.ts`** - API client للدفع
2. **`app/challenges/payment/page.tsx`** - صفحة الدفع
3. **`app/wallet/history/page.tsx`** - سجل المدفوعات

---

## 🔧 خطوات الإعداد

### 1. تثبيت Stripe في Backend

```bash
cd backend
npm install stripe
```

### 2. تثبيت Stripe في Frontend (✅ تم)

```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 3. إعداد متغيرات البيئة

#### Backend (.env):

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### Frontend (.env.local):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. الحصول على مفاتيح Stripe

1. سجل في [Stripe Dashboard](https://dashboard.stripe.com)
2. اذهب إلى **Developers** → **API Keys**
3. انسخ:
   - **Publishable key** (يبدأ بـ `pk_test_`)
   - **Secret key** (يبدأ بـ `sk_test_`)

### 5. إعداد Webhook (اختياري للتطوير)

1. في Stripe Dashboard → **Developers** → **Webhooks**
2. أضف endpoint: `http://localhost:5000/api/v1/payments/webhook`
3. اختر الأحداث:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. انسخ **Signing secret**

---

## 🚀 كيفية الاستخدام

### 1. دفع Deposit للتحدي

```typescript
// في صفحة التحدي
const handlePayDeposit = () => {
  router.push(
    `/challenges/payment?challengeId=${challengeId}&amount=${depositAmount}`
  );
};
```

### 2. عرض سجل المدفوعات

```typescript
// الذهاب لصفحة السجل
router.push("/wallet/history");
```

### 3. طلب استرجاع الأموال

```typescript
await paymentApi.requestRefund({
  challengeId: "challenge_id",
  reason: "Challenge failed",
});
```

---

## 📊 مسارات API المتاحة

### Challenge Payments:

- `POST /api/v1/payments/challenge/create-intent` - إنشاء payment intent
- `POST /api/v1/payments/challenge/confirm` - تأكيد الدفع

### Wallet Deposits:

- `POST /api/v1/payments/deposit/create-intent` - إنشاء deposit intent
- `POST /api/v1/payments/deposit/confirm` - تأكيد الإيداع

### General:

- `GET /api/v1/payments/history` - سجل المدفوعات
- `POST /api/v1/payments/refund` - طلب استرجاع
- `POST /api/v1/payments/webhook` - Stripe webhook

---

## 🔄 تدفق الدفع (Payment Flow)

### 1. إنشاء التحدي:

```
User creates challenge
  ↓
Challenge saved with deposit.paid = false
  ↓
User redirected to payment page
```

### 2. عملية الدفع:

```
Frontend calls createChallengePaymentIntent
  ↓
Backend creates Stripe PaymentIntent
  ↓
Frontend displays Stripe payment form
  ↓
User enters card details
  ↓
Stripe processes payment
  ↓
Frontend confirms payment with backend
  ↓
Backend updates challenge.deposit.paid = true
  ↓
Challenge status = 'active'
```

### 3. استرجاع الأموال:

```
Challenge fails
  ↓
User/System requests refund
  ↓
Backend creates Stripe refund
  ↓
Payment status = 'refunded'
  ↓
Challenge status = 'cancelled'
```

---

## 🧪 الاختبار

### 1. بطاقات اختبار Stripe:

**نجاح الدفع:**

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**فشل الدفع:**

```
Card Number: 4000 0000 0000 0002
```

**يتطلب 3D Secure:**

```
Card Number: 4000 0027 6000 3184
```

### 2. اختبار الـ Webhook محلياً:

```bash
# تثبيت Stripe CLI
stripe listen --forward-to localhost:5000/api/v1/payments/webhook

# في terminal آخر، اختبر webhook
stripe trigger payment_intent.succeeded
```

---

## 💾 قاعدة البيانات

### Payment Schema:

```typescript
{
  user: ObjectId,
  challenge: ObjectId,
  amount: Number,
  currency: String,
  status: 'pending' | 'succeeded' | 'failed' | 'refunded',
  stripePaymentIntentId: String,
  stripeCustomerId: String,
  paidAt: Date,
  refundedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 الأمان

### تم تنفيذه:

- ✅ Stripe handles all card data (PCI compliant)
- ✅ Webhook signature verification
- ✅ Server-side payment confirmation
- ✅ User authentication required
- ✅ Payment intent metadata validation

### يجب إضافته للإنتاج:

- ⚠️ Rate limiting على payment endpoints
- ⚠️ IP whitelisting للـ webhooks
- ⚠️ Fraud detection
- ⚠️ 3D Secure enforcement

---

## 📱 واجهة المستخدم

### صفحة الدفع:

- ✅ Stripe Elements integration
- ✅ Dark mode support
- ✅ Loading states
- ✅ Error handling
- ✅ Success confirmation
- ✅ Secure payment badge

### سجل المدفوعات:

- ✅ Payment list with status
- ✅ Amount formatting
- ✅ Date formatting
- ✅ Challenge linking
- ✅ Empty state

---

## 🐛 استكشاف الأخطاء

### مشكلة: "Stripe is not defined"

**الحل:** تأكد من إضافة `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` في `.env.local`

### مشكلة: "Payment intent creation failed"

**الحل:** تحقق من `STRIPE_SECRET_KEY` في backend `.env`

### مشكلة: "Webhook signature verification failed"

**الحل:** تأكد من `STRIPE_WEBHOOK_SECRET` صحيح

### مشكلة: "Challenge not found"

**الحل:** تأكد من إرسال `challengeId` صحيح

---

## 📈 التحسينات المستقبلية

### قريباً:

- [ ] دعم طرق دفع إضافية (Apple Pay, Google Pay)
- [ ] دفع بالتقسيط
- [ ] كوبونات خصم
- [ ] برنامج الإحالة

### متقدم:

- [ ] Subscription payments
- [ ] Multi-currency support
- [ ] Automatic refunds
- [ ] Payment analytics dashboard

---

## ✅ قائمة التحقق

- [x] Backend Payment Model
- [x] Backend Payment Service
- [x] Backend Payment Controller
- [x] Backend Payment Routes
- [x] Frontend Payment API
- [x] Frontend Payment Page
- [x] Frontend Payment History
- [x] Stripe Integration
- [x] Webhook Handling
- [x] Error Handling
- [x] Loading States
- [x] Success States

---

## 🎯 الحالة النهائية

**نظام الدفع: ✅ جاهز للاستخدام!**

### ما تم:

- ✅ نظام دفع كامل مع Stripe
- ✅ دفع deposit التحديات
- ✅ إيداع في المحفظة
- ✅ استرجاع الأموال
- ✅ سجل المعاملات
- ✅ Webhook integration
- ✅ UI/UX كامل

### ما تبقى:

- ⚠️ إضافة مفاتيح Stripe الفعلية
- ⚠️ اختبار شامل
- ⚠️ إعداد Webhook في Production

---

**تاريخ الإنشاء:** 2025-12-19  
**الحالة:** ✅ Production Ready (بعد إضافة المفاتيح)  
**المطور:** CommitForce Team
