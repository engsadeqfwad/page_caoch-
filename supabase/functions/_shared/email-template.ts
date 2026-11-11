import { getBmiAnalysis, getPathCompatibility, type ValidRegistration } from './registration.ts';

const locationLabels: Record<string, string> = { home: 'المنزل', gym: 'الجيم', both: 'المنزل والجيم معاً' };
const levelLabels: Record<string, string> = { beginner: 'مبتدئة', intermediate: 'متوسطة', advanced: 'متقدمة' };
const lifestyleLabels: Record<string, string> = {
  office: 'عمل مكتبي — جلوس معظم اليوم', active: 'حركة كثيرة — وقوف وتنقل مستمر',
  student: 'دراسة ومشي كثير', housewife: 'ربة منزل نشطة',
};

export function buildFormData(data: ValidRegistration, submittedAt: string) {
  const { height, weight, ...details } = data;
  const bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));
  const analysis = getBmiAnalysis(bmi);
  return {
    ...details, heightCm: height, weightKg: weight, bmi,
    bmiCategory: analysis.category, physicalNeed: analysis.physicalNeed,
    pathCompatibility: getPathCompatibility(analysis.physicalNeed, data.pathId),
    trainingLocationLabel: locationLabels[data.trainingLocation],
    experienceLevelLabel: levelLabels[data.experienceLevel], lifestyleLabel: lifestyleLabels[data.lifestyle],
    submittedAt,
    submittedAtDisplay: new Intl.DateTimeFormat('ar-EG', {
      timeZone: 'Asia/Riyadh', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(new Date(submittedAt)),
  };
}

function escapeHtml(value: string | number) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export function buildRegistrationEmail(id: string, form: ReturnType<typeof buildFormData>, from: string, recipient: string) {
  const fields: [string, string | number][] = [
    ['باقة الاشتراك', `${form.selectedPlan.name} — ${form.selectedPlan.priceSAR} ريال / ${form.selectedPlan.duration}`],
    ['رقم الواتساب', form.phone], ['يوزر الإنستجرام', form.instagram],
    ['دولة الإقامة', form.country], ['دولة ورمز الهاتف', `${form.phoneCountryName} (${form.phoneCountryCode})`],
    ['العمر', form.age], ['الطول سم', form.heightCm], ['الوزن كغ', form.weightKg],
    ['مؤشر BMI', `${form.bmi} (${form.bmiCategory})`], ['توافق المسار مع البدن', form.pathCompatibility],
    ['المسار المختار', form.pathName], ['مكان التدريب', form.trainingLocationLabel],
    ['مستوى المتدربة', form.experienceLevelLabel], ['أيام التدريب أسبوعياً', form.trainingDays],
    ['نمط الحياة', form.lifestyleLabel], ['المشاكل الصحية', form.healthIssues], ['الأدوية', form.medications],
    ['لغة النموذج', form.language === 'ar' ? 'العربية' : 'الإنجليزية'], ['وقت الطلب بتوقيت الرياض', form.submittedAtDisplay],
  ];
  return {
    from, to: [recipient],
    subject: `طلب اشتراك جديد #${id.slice(0, 8)} — ${form.country.replace(/[\r\n]/g, ' ')}`,
    text: ['طلب اشتراك جديد — موقع المدربة حنان خالد', `رقم الطلب: ${id}`, '',
      ...fields.map(([label, value]) => `${label}: ${value}`)].join('\n'),
    html: `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;padding:24px 12px;background:#0e0e11;color:#f8f7fb;font-family:Tahoma,Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#17171b;border:1px solid #303038;border-radius:18px;overflow:hidden;">
        <div style="padding:24px;background:#241d35;border-bottom:1px solid #3b334b;">
          <div style="color:#d8c8ff;">موقع المدربة حنان خالد</div><h1 style="font-size:24px;">طلب اشتراك جديد</h1>
          <div style="direction:ltr;text-align:right;">#${escapeHtml(id)}</div>
        </div><div style="padding:8px 24px 24px;">
          ${fields.map(([label, value]) => `<div style="padding:16px 0;border-bottom:1px solid #2f2f35;">
            <div style="color:#b9a7ff;font-size:13px;font-weight:700;margin-bottom:7px;">${escapeHtml(label)}</div>
            <div style="font-size:16px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(value)}</div></div>`).join('')}
        </div></div></body></html>`,
    tags: [{ name: 'registration_id', value: id }],
  };
}
