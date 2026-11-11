# موقع المدربة حنان خالد

واجهة React وTypeScript مبنية باستخدام Vite وTailwind، مع نموذج تسجيل يحفظ البيانات في Supabase ويرسل إشعارات عبر Resend.

## التشغيل والتحقق

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
```

تستخدم الاختبارات PostgreSQL معزولًا عبر PGlite وخدمة بريد وهمية، ولا تتصل ببيانات الإنتاج.

## إعداد البريد والنشر

راجع [دليل تحويل استقبال الطلبات ونشر الإصلاحات](docs/registration-deployment.md) لتعيين `NOTIFICATION_EMAIL=sadeq202077@gmail.com`، وتطبيق الترحيل، ونشر الدوال الثلاث، وتفعيل Cron وWebhook.

تعتمد الواجهة والخادم على تعريف الباقات وحدود البيانات في `supabase/functions/_shared/registration.ts`. تُحفظ الطلبات قبل إرسال إشعار البريد، وتستخدم المحاولات المتكررة المعرّف نفسه لمنع التكرار.
