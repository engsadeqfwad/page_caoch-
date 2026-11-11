// Shared by the browser and Edge Functions. Keep prices and accepted ranges here.
export const REGISTRATION_LIMITS = {
  age: { min: 16, max: 80 },
  height: { min: 120, max: 220 },
  weight: { min: 35, max: 250 },
  country: 100,
  healthIssues: 2_000,
  medications: 1_000,
} as const;

export const REGISTRATION_PLANS = {
  plus: { id: 'plus', name: 'باقة الشهرين (Plus)', priceSAR: 100, duration: 'شهران (2 Months)' },
  premium: { id: 'premium', name: 'باقة الـ 3 أشهر (Premium)', priceSAR: 150, duration: 'ثلاثة أشهر (3 Months)' },
} as const;

export const REGISTRATION_PATHS = {
  'feminine-shape': 'القوام الأنثوي',
  'weight-gain': 'زيادة الوزن الصحية والأنثوية',
  'fat-loss': 'التنحيف والنحت',
  recomposition: 'إعادة تشكيل الجسم',
  'glute-lower': 'الأرداف والجزء السفلي',
  'home-transformation': 'التحول من المنزل',
  'therapeutic-health': 'التغذية العلاجية والحالات الصحية',
} as const;

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const EMAIL_PATTERN = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
export const DEFAULT_NOTIFICATION_EMAIL = 'sadeq202077@gmail.com';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedText(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed : '';
}

function boundedNumber(value: unknown, min: number, max: number, integer = false) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max && (!integer || Number.isInteger(number))
    ? number : null;
}

export function validateRegistration(input: unknown) {
  if (!isRecord(input)) return { ok: false as const, fields: ['body'] };
  const age = boundedNumber(input.age, REGISTRATION_LIMITS.age.min, REGISTRATION_LIMITS.age.max, true);
  const height = boundedNumber(input.height, REGISTRATION_LIMITS.height.min, REGISTRATION_LIMITS.height.max);
  const weight = boundedNumber(input.weight, REGISTRATION_LIMITS.weight.min, REGISTRATION_LIMITS.weight.max);
  const trainingDays = boundedNumber(input.trainingDays, 2, 5, true);
  const country = boundedText(input.country, REGISTRATION_LIMITS.country);
  const phone = boundedText(input.phone, 24);
  const instagram = boundedText(input.instagram, 31).replace(/^@/, '');
  const phoneCountryCode = boundedText(input.phoneCountryCode, 2).toUpperCase();
  const phoneCountryName = boundedText(input.phoneCountryName, 100);
  const pathId = boundedText(input.pathId, 50);
  const selectedPlan = isRecord(input.selectedPlan) ? input.selectedPlan : {};
  const planId = boundedText(selectedPlan.id, 50);
  const pathName = Object.prototype.hasOwnProperty.call(REGISTRATION_PATHS, pathId)
    ? REGISTRATION_PATHS[pathId as keyof typeof REGISTRATION_PATHS] : null;
  const plan = Object.prototype.hasOwnProperty.call(REGISTRATION_PLANS, planId)
    ? REGISTRATION_PLANS[planId as keyof typeof REGISTRATION_PLANS] : null;
  const trainingLocation = boundedText(input.trainingLocation, 20);
  const experienceLevel = boundedText(input.experienceLevel, 20);
  const lifestyle = boundedText(input.lifestyle, 30);
  const healthIssues = boundedText(input.healthIssues, REGISTRATION_LIMITS.healthIssues);
  const medications = boundedText(input.medications, REGISTRATION_LIMITS.medications);
  const submissionId = input.submissionId === undefined ? undefined : boundedText(input.submissionId, 36);
  const fields = Object.entries({
    age: age !== null,
    height: height !== null,
    weight: weight !== null,
    trainingDays: trainingDays !== null,
    country: country.length >= 2,
    phone: /^\+[1-9]\d{6,14}$/.test(phone),
    instagram: /^[A-Za-z0-9._]{1,30}$/.test(instagram),
    phoneCountryCode: /^[A-Z]{2}$/.test(phoneCountryCode),
    phoneCountryName: phoneCountryName.length > 0,
    pathId: pathName !== null,
    selectedPlan: plan !== null,
    trainingLocation: ['home', 'gym', 'both'].includes(trainingLocation),
    experienceLevel: ['beginner', 'intermediate', 'advanced'].includes(experienceLevel),
    lifestyle: ['office', 'active', 'student', 'housewife'].includes(lifestyle),
    healthIssues: healthIssues.length > 0,
    medications: medications.length > 0,
    submissionId: submissionId === undefined || UUID_PATTERN.test(submissionId),
    website: input.website === undefined || input.website === '',
  }).filter(([, valid]) => !valid).map(([field]) => field);
  if (fields.length || age === null || height === null || weight === null || trainingDays === null || !pathName || !plan) {
    return { ok: false as const, fields };
  }
  // Labels, prices and durations supplied by a browser are deliberately ignored.
  return {
    ok: true as const,
    submissionId,
    data: {
      age, height, weight, country, phoneCountryCode, phoneCountryName, phone,
      instagram: `@${instagram}`, pathId, pathName, trainingLocation, experienceLevel,
      trainingDays, lifestyle, healthIssues, medications,
      selectedPlan: { ...plan }, language: input.language === 'en' ? 'en' : 'ar',
    },
  };
}

export type ValidRegistration = Extract<ReturnType<typeof validateRegistration>, { ok: true }>['data'];

export function getBmiAnalysis(bmi: number) {
  if (bmi < 18.5) return { category: 'نقص في الوزن (يحتاج زيادة امتلاء أنثوي)', categoryEn: 'Underweight (Needs feminine fullness & weight gain)', physicalNeed: 'weight-gain', color: 'text-amber-400' };
  if (bmi <= 21) return { category: 'متوسط (يحتاج زيادة وزن قليلة وامتلاء أنثوي)', categoryEn: 'Average (Needs slight weight gain & feminine fullness)', physicalNeed: 'moderate-gain', color: 'text-amber-300' };
  if (bmi < 25) return { category: 'وزن طبيعي ومثالي', categoryEn: 'Normal & Ideal Weight', physicalNeed: 'ideal', color: 'text-emerald-400' };
  if (bmi < 30) return { category: 'زيادة بسيطة في الوزن (يحتاج نحت وتنحيف)', categoryEn: 'Slight Overweight (Needs sculpting & fat loss)', physicalNeed: 'fat-loss', color: 'text-amber-300' };
  return { category: 'زيادة ملحوظة / سمنة (يحتاج خفض دهون ونحت)', categoryEn: 'Overweight / Obesity (Needs fat reduction & sculpting)', physicalNeed: 'high-fat-loss', color: 'text-rose-400' };
}

export function getPathCompatibility(physicalNeed: string, pathId: string) {
  const gain = ['weight-gain', 'moderate-gain'].includes(physicalNeed);
  const loss = ['fat-loss', 'high-fat-loss'].includes(physicalNeed);
  return (gain && pathId === 'fat-loss') || (loss && pathId === 'weight-gain')
    ? '⚠️ المسار المختار لا يتناسب مع كتلة الجسم وتلزم المراجعة'
    : 'لا يظهر تعارض مبدئي وفق BMI؛ تراجع المدربة ملاءمة المسار للحالة';
}
