# 🚀 دليل الميزات المتقدمة - CommitForce

هذا الدليل يشرح كيفية إعداد واستخدام الميزات المتقدمة التي تم إضافتها للمشروع.

---

## 📧 1. Email Service Integration

### الوصف

خدمة بريد إلكتروني متكاملة لإرسال:

- رسائل إعادة تعيين كلمة المرور
- رسائل الترحيب
- تذكيرات التحديات
- إشعارات إكمال التحديات

### الإعداد

**الخطوة 1:** إضافة متغيرات البيئة في `.env`:

```env
# Gmail (الأسهل للتطوير)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@commitforce.com
FROM_NAME=CommitForce
```

**للحصول على App Password من Gmail:**

1. اذهب لـ Google Account > Security
2. فعّل 2-Step Verification
3. اذهب لـ App Passwords
4. أنشئ password جديد لـ "Mail"

**الخطوة 2:** الاستخدام في الكود:

```typescript
import emailService from "./services/email.service";

// إرسال بريد إعادة تعيين كلمة المرور
await emailService.sendPasswordResetEmail(email, userName, resetToken);

// إرسال بريد ترحيب
await emailService.sendWelcomeEmail(email, userName);

// تذكير بالتحدي
await emailService.sendChallengeReminderEmail(
  email,
  userName,
  challengeTitle,
  daysLeft
);
```

### الملفات

- `backend/src/services/email.service.ts` - الخدمة الرئيسية
- `backend/src/services/auth.service.ts` - تم دمجها مع forgotPassword

---

## 💬 2. Real-time Chat (Socket.IO)

### الوصف

نظام دردشة فورية يدعم:

- رسائل مباشرة بين المستخدمين
- مؤشر "يكتب..."
- إشعارات القراءة
- حالة الاتصال (Online/Offline)
- تحديثات التحديات الفورية

### الإعداد

**Backend:**
Socket.IO مُعد مسبقاً في `backend/src/config/socket.ts`

**Frontend:**
استخدم الـ hooks الجاهزة:

```typescript
import { useSocket, useChat, useNotifications } from "@/hooks/useSocket";

// في component الرسائل
function ChatComponent() {
  const { messages, sendMessage, typingUsers, isConnected } =
    useChat(conversationId);

  // إرسال رسالة
  const handleSend = () => {
    sendMessage(recipientId, messageContent);
  };

  return (
    <div>
      {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      {/* عرض الرسائل */}
    </div>
  );
}
```

### الأحداث المدعومة

| الحدث           | الوصف            |
| --------------- | ---------------- |
| `chat:join`     | الانضمام لمحادثة |
| `chat:leave`    | مغادرة محادثة    |
| `chat:message`  | إرسال رسالة      |
| `chat:typing`   | مؤشر الكتابة     |
| `chat:markRead` | تحديد كمقروء     |
| `user:online`   | حالة الاتصال     |

### الملفات

- `backend/src/config/socket.ts` - إعداد Socket.IO
- `frontend/src/hooks/useSocket.ts` - React hooks

---

## 🔔 3. Push Notifications

### الوصف

إشعارات الويب (Web Push) لإرسال تنبيهات حتى لو كان المستخدم خارج الموقع.

### الإعداد

**الخطوة 1:** توليد مفاتيح VAPID:

```bash
npx web-push generate-vapid-keys
```

**الخطوة 2:** إضافة المفاتيح للـ environment:

```env
# Backend
VAPID_PUBLIC_KEY=BNx...your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_SUBJECT=mailto:admin@commitforce.com

# Frontend
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BNx...your-public-key
```

**الخطوة 3:** استخدام الـ hook:

```typescript
import {
  usePushNotifications,
  showNotification,
} from "@/hooks/usePushNotifications";

function NotificationSettings() {
  const { supported, permission, isSubscribed, subscribe, unsubscribe } =
    usePushNotifications();

  return (
    <button onClick={subscribe}>
      {isSubscribed ? "Disable Notifications" : "Enable Notifications"}
    </button>
  );
}

// إظهار إشعار محلي
showNotification("Challenge Reminder", {
  body: "Time to check in!",
  icon: "/logo.png",
});
```

### الملفات

- `frontend/src/hooks/usePushNotifications.ts` - React hook
- `frontend/public/sw.js` - Service Worker

---

## 🖼️ 4. Image Optimization

### الوصف

تحسين الصور تلقائياً عند الرفع:

- ضغط حتى 80%
- تحويل لـ WebP
- أحجام متعددة (thumbnail, avatar, cover)
- Blur placeholder للتحميل السلس

### الإعداد

الخدمة جاهزة للاستخدام! استخدم الـ middleware في الـ routes:

```typescript
import { upload, optimizeImage } from "../middleware/upload.middleware";

// رفع وتحسين صورة
router.post(
  "/upload",
  upload.single("image"),
  optimizeImage("avatar"), // أو 'thumbnail', 'cover', 'checkin', 'full'
  async (req, res) => {
    // req.file يحتوي الآن على الصورة المحسنة
    console.log("Optimization:", req.imageOptimization);
    // { originalSize, optimizedSize, savedPercentage, width, height }
  }
);
```

### الأحجام المتاحة (Presets)

| Preset      | الأبعاد   | الجودة | الاستخدام        |
| ----------- | --------- | ------ | ---------------- |
| `avatar`    | 200×200   | 80%    | صور الملف الشخصي |
| `thumbnail` | 300×200   | 75%    | الصور المصغرة    |
| `cover`     | 1200×630  | 80%    | صور الأغلفة      |
| `checkin`   | 800×800   | 85%    | صور Check-in     |
| `full`      | 1920×1080 | 85%    | الصور الكاملة    |

### الملفات

- `backend/src/services/imageOptimizer.service.ts` - الخدمة
- `backend/src/middleware/upload.middleware.ts` - Middleware

---

## 📦 التثبيت

تأكد من تثبيت الحزم المطلوبة:

**Backend:**

```bash
cd backend
npm install nodemailer sharp uuid socket.io web-push
npm install -D @types/nodemailer @types/uuid
```

**Frontend:**

```bash
cd frontend
npm install socket.io-client
```

---

## 🔧 استكشاف الأخطاء

### Email لا يعمل

1. تأكد من SMTP settings
2. لـ Gmail: استخدم App Password وليس كلمة المرور العادية
3. تحقق من الـ console للأخطاء

### Socket.IO لا يتصل

1. تأكد من أن الـ backend يعمل
2. تحقق من CORS settings
3. تأكد من وجود token صحيح

### Push Notifications لا تظهر

1. تأكد من VAPID keys
2. المستخدم يجب أن يوافق على الإشعارات
3. بعض المتصفحات تحتاج HTTPS

### الصور لا تُضغط

1. تأكد من تثبيت `sharp`
2. بعض أنظمة التشغيل تحتاج تجميع sharp من المصدر

---

## 📝 ملاحظات

- **الإنتاج:** غيّر جميع المفاتيح والـ secrets
- **SSL:** استخدم HTTPS في الإنتاج
- **Scaling:** لـ Socket.IO مع servers متعددة، استخدم Redis adapter
