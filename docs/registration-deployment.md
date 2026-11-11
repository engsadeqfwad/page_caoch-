# تحويل استقبال الطلبات وإطلاق الإصلاحات

البريد المطلوب: **sadeq202077@gmail.com**.
مرجع مشروع Supabase المكتوب حاليًا في الواجهة: `jajwrjblsbdfbhbrfyku`.
تحقق من أنه المشروع المستخدم للموقع، خصوصًا إذا كانت الاستضافة تضبط `VITE_REGISTRATION_ENDPOINT` بعنوان مختلف.

## تغيير المستلم فقط، دون انتظار نشر الإصلاحات

1. افتح مشروع الموقع في Supabase، ثم **Edge Functions → Secrets**.
2. حدّث `NOTIFICATION_EMAIL` إلى `sadeq202077@gmail.com` واحفظه.
3. أبقِ `RESEND_FROM_EMAIL` على عنوان المرسل الحالي من نطاقك الموثّق في Resend؛ تغيير المستلم إلى Gmail لا يعني استخدام Gmail كعنوان مرسل.
4. تحقق من أن `RESEND_API_KEY` يخص الحساب والنطاق الموثقين.

الدالة الحالية تقرأ المستلم من هذا المتغير عند معالجة الطلب. تحديثه لا يحتاج إلى تعديل جدول التسجيلات أو تغيير البريد العام في تذييل الموقع. القيمة السرية الموجودة في Supabase تتقدم على القيمة الافتراضية الموجودة في الكود؛ لذلك لا يكفي نشر الكود وحده إذا بقيت القيمة القديمة.

البديل عبر CLI بعد تسجيل الدخول:

```powershell
npx supabase login
npx supabase secrets set NOTIFICATION_EMAIL=sadeq202077@gmail.com --project-ref jajwrjblsbdfbhbrfyku
```

إذا كان المرسل `onboarding@resend.dev`، فاستبدله بعنوان من نطاقك الموثق قبل توقع وصول الرسائل إلى مستلم آخر. لا تغيّر المرسل إلى `sadeq202077@gmail.com`.

## نشر الإصلاحات كاملة بالترتيب

### 1. قاعدة البيانات أولًا

في **SQL Editor** للمشروع الصحيح، شغّل محتوى:

`supabase/migrations/20261111000100_reliable_registration_notifications.sql`

للمشروع الجديد فقط، شغّل ملف `20261021000100_secure_registrations.sql` قبل الملف الجديد. إذا كنت تدير قاعدة المشروع أصلًا عبر Supabase CLI، طبّق الترحيل بالطريقة المعتادة بعد مراجعة قائمة الترحيلات المعلقة. تجنب تشغيل طرق متعددة لتطبيق الترحيل نفسه دون تتبع حالته.

الترحيل الجديد يضيف أعمدة ودوال وفهارس. لا يحذف التسجيلات السابقة، ولا يعيد إرسالها، ولا يغيّر أرقام الهواتف أو البيانات القديمة. يجب تطبيقه قبل نشر الدالة الجديدة التي تعتمد عليه.

### 2. إعداد متغيرات الدوال

داخل **Edge Functions → Secrets**:

| الاسم | القيمة |
|---|---|
| `NOTIFICATION_EMAIL` | `sadeq202077@gmail.com` |
| `RESEND_FROM_EMAIL` | عنوان المرسل الحالي من نطاق Resend الموثق، مثل `Hanan Coaching <registrations@yourdomain.com>` |
| `RESEND_API_KEY` | مفتاح Resend الحالي الصحيح |
| `ALLOWED_ORIGINS` | عناوين الموقع الفعلية، مفصولة بفواصل، مع البروتوكول ودون شرطة مائلة أخيرة |
| `IP_HASH_SALT` | أبقِ القيمة السرية الحالية |
| `ALLOW_LOCAL_ORIGINS` | `false` في الإنتاج |
| `EMAIL_RETRY_SECRET` | قيمة عشوائية جديدة بطول 32 محرفًا على الأقل |

مثال صيغة المصادر: `https://example.com,https://www.example.com`. أضف عنوان معاينات الاستضافة المحدد فقط إذا كنت تريد استقبال طلبات منها.

يمكن توليد قيمة عشوائية على جهازك:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

يوفر Supabase المستضاف `SUPABASE_URL` و`SUPABASE_SERVICE_ROLE_KEY` تلقائيًا. لا تضع مفتاح الخادم في متغير يبدأ بـ `VITE_`.

إذا استخدمت ملف متغيرات، انسخ `supabase/functions/.env.example` إلى `supabase/functions/.env.local`، واستبدل الأمثلة بالقيم الصحيحة، ثم:

```powershell
npx supabase secrets set --env-file supabase/functions/.env.local --project-ref jajwrjblsbdfbhbrfyku
```

لا ترفع قيم الأمثلة كما هي. المتغير `RESEND_WEBHOOK_SECRET` يُستكمل من الخطوة الرابعة.

### 3. نشر الدوال الثلاث

```powershell
npx supabase functions deploy submit-registration --project-ref jajwrjblsbdfbhbrfyku
npx supabase functions deploy retry-registration-emails --project-ref jajwrjblsbdfbhbrfyku
npx supabase functions deploy resend-webhook --project-ref jajwrjblsbdfbhbrfyku
```

إعداد `verify_jwt = false` معرف للدوال الثلاث في `supabase/config.toml`. دالة التسجيل عامة مع تحقق من المدخلات وتقييد للطلبات؛ دالة إعادة المحاولة تتطلب السر الخاص بها؛ ودالة Webhook تتحقق من توقيع Resend. لا تضف عنوان Webhook أو إعادة المحاولة إلى `VITE_REGISTRATION_ENDPOINT`.

### 4. تفعيل تتبع التسليم في Resend

في **Resend → Webhooks → Add Webhook**، استخدم:

```text
https://jajwrjblsbdfbhbrfyku.supabase.co/functions/v1/resend-webhook
```

اختر الأحداث:

- `email.delivered`
- `email.bounced`
- `email.failed`
- `email.complained`
- `email.suppressed`

انسخ Signing Secret الذي يبدأ عادة بـ `whsec_` إلى متغير `RESEND_WEBHOOK_SECRET` في Supabase. يقبل الخادم الأحداث الموقعة فقط. اجعل هذا Webhook مخصصًا لهذا التطبيق إن كان الحساب يرسل رسائل لتطبيقات أخرى.

`accepted` تعني قبول Resend لطلب الإرسال. `delivered` تعني أن Resend أبلغ بتسليم الرسالة لخادم بريد المستلم؛ لا تثبت قراءة الرسالة أو وضعها في مجلد البريد الوارد.

### 5. تشغيل إعادة المحاولة التلقائية

1. فعّل `pg_cron` و`pg_net` من **Database → Extensions**.
2. في **Vault** أنشئ:
   - `registration_project_url`: قيمة `https://jajwrjblsbdfbhbrfyku.supabase.co`.
   - `registration_retry_secret`: القيمة نفسها التي وضعتها في `EMAIL_RETRY_SECRET`.
3. شغّل `supabase/ops/schedule-registration-emails.sql` في SQL Editor.
4. راجع مهمة `retry-registration-emails` في Cron وسجل استدعاءات الدالة. تستدعى مرة كل دقيقة وتعالج حتى ثلاث رسائل مستحقة في الاستدعاء.

تُحفظ نسخة ثابتة من الرسالة والمستلم مع كل طلب جديد، وتستخدم إعادة المحاولة مفتاح Idempotency ثابتًا لدى Resend. بعد ست محاولات، أو مرور 23 ساعة على إنشاء الطلب، تتحول الحالة إلى `needs_review` بدل إعادة الإرسال تلقائيًا خارج نافذة منع التكرار. راجع رسالة Resend باستخدام `email_id` أو معرّف الطلب قبل اتخاذ إجراء يدوي. لا تمسح بيانات منع التكرار لإجبار إعادة الإرسال.

### 6. نشر الواجهة

```powershell
npm ci
npm test
npm run lint
npm run build
```

انشر مجلد `dist` عبر الاستضافة الحالية. إذا كانت الاستضافة تضبط `VITE_REGISTRATION_ENDPOINT`، فيجب أن يشير إلى دالة `submit-registration` في المشروع نفسه. إعادة بناء الواجهة ضرورية لتضمين متغيرات Vite الجديدة إن تغيرت.

تدعم الدالة الجديدة مؤقتًا الواجهة القديمة التي لا ترسل `submissionId`، لكن منع تكرار محاولة الزائرة يعتمد على نشر الواجهة المحدثة. لا تنشر الواجهة الجديدة قبل الدالة وقاعدة البيانات.

### 7. التحقق بعد النشر

بعد نشر الأجزاء السابقة، قدّم طلبًا تجريبيًا واحدًا من الموقع:

1. احفظ معرّف الطلب الظاهر في شاشة التأكيد.
2. تحقق من صف واحد في `registrations`، وأن `email_recipient = sadeq202077@gmail.com`.
3. تحقق من `email_id` وحالة `accepted` ثم `delivered` بعد وصول Webhook.
4. تحقق من الرسالة في Gmail بما في ذلك مجلد الرسائل غير المرغوب فيها.
5. إذا فشل البريد، افحص `email_error` و`email_attempts` و`email_next_retry_at` وسجلات الدالة ومهمة Cron.

الاختبارات المحلية لا تتصل بقاعدة الإنتاج ولا ترسل بريدًا. تستخدم PostgreSQL محليًا معزولًا عبر PGlite وخدمة بريد وهمية، وتتحقق من توقيعات Webhook بالمكتبة الفعلية. يبقى تحقق النطاق والإعدادات والتسليم الحقيقي خطوة بعد النشر.

## التراجع عن نشر غير مناسب

يمكن إعادة نشر نسخة الواجهة والدالة السابقة مع إبقاء الأعمدة والدوال الإضافية في قاعدة البيانات. إذا أوقفت مسار الإرسال الجديد، عطّل مهمة `retry-registration-emails` من Cron وWebhook الخاص به من Resend. لا تحذف بيانات الطلبات أو أعمدة متابعة الرسائل أثناء التراجع. تظل قيمة `NOTIFICATION_EMAIL` في Supabase هي التي تحدد مستلم الدالة القديمة.

## المراجع

- [متغيرات وأسرار Supabase](https://supabase.com/docs/guides/functions/secrets)
- [جدولة Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [قيود عنوان resend.dev التجريبي](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
- [منع تكرار البريد في Resend](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [التحقق من توقيعات Webhook](https://resend.com/docs/webhooks/verify-webhooks-requests)
