import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type RegistrationRequest = {
  age?: unknown;
  country?: unknown;
  phoneCountryCode?: unknown;
  phoneCountryName?: unknown;
  phone?: unknown;
  instagram?: unknown;
  height?: unknown;
  weight?: unknown;
  pathId?: unknown;
  pathName?: unknown;
  trainingLocation?: unknown;
  experienceLevel?: unknown;
  trainingDays?: unknown;
  lifestyle?: unknown;
  healthIssues?: unknown;
  medications?: unknown;
  selectedPlan?: {
    id?: unknown;
    name?: unknown;
    priceSAR?: unknown;
    duration?: unknown;
  };
  language?: unknown;
  website?: unknown;
};

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };

function response(body: Record<string, unknown>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...jsonHeaders,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      Vary: 'Origin',
    },
  });
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function numberInRange(value: unknown, min: number, max: number) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function formatLocation(value: string) {
  return value === 'home' ? 'المنزل' : value === 'gym' ? 'الجيم' : 'المنزل والجيم معاً';
}

function formatLevel(value: string) {
  return value === 'beginner' ? 'مبتدئة' : value === 'intermediate' ? 'متوسطة' : 'متقدمة';
}

function formatLifestyle(value: string) {
  const labels: Record<string, string> = {
    office: 'عمل مكتبي — جلوس معظم اليوم',
    active: 'حركة كثيرة — وقوف وتنقل مستمر',
    student: 'دراسة ومشي كثير',
    housewife: 'ربة منزل نشطة',
  };
  return labels[value] ?? value;
}

Deno.serve(async (request) => {
  const configuredOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request.headers.get('origin') ?? '';
  const isLocalOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin);
  const isAllowedOrigin = configuredOrigins.includes(requestOrigin) || isLocalOrigin;
  const responseOrigin = isAllowedOrigin ? requestOrigin : configuredOrigins[0] ?? 'null';

  if (request.method === 'OPTIONS') {
    return response({}, isAllowedOrigin ? 200 : 403, responseOrigin);
  }

  if (request.method !== 'POST') {
    return response({ success: false, message: 'Method not allowed' }, 405, responseOrigin);
  }

  if (!isAllowedOrigin) {
    return response({ success: false, message: 'Origin not allowed' }, 403, responseOrigin);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 50_000) {
    return response({ success: false, message: 'Request is too large' }, 413, responseOrigin);
  }

  let body: RegistrationRequest;
  try {
    body = await request.json();
  } catch {
    return response({ success: false, message: 'Invalid request body' }, 400, responseOrigin);
  }

  // Honeypot: real visitors never fill this hidden field.
  if (text(body.website, 200)) {
    return response({ success: true }, 200, responseOrigin);
  }

  const age = numberInRange(body.age, 16, 80);
  const height = numberInRange(body.height, 120, 220);
  const weight = numberInRange(body.weight, 35, 250);
  const trainingDays = numberInRange(body.trainingDays, 2, 5);
  const country = text(body.country, 100);
  const phoneCountryCode = text(body.phoneCountryCode, 5).toUpperCase();
  const phoneCountryName = text(body.phoneCountryName, 100);
  const phone = text(body.phone, 24);
  const instagram = text(body.instagram, 30).replace(/^@+/, '');
  const pathId = text(body.pathId, 50);
  const pathName = text(body.pathName, 150);
  const trainingLocation = text(body.trainingLocation, 20);
  const experienceLevel = text(body.experienceLevel, 20);
  const lifestyle = text(body.lifestyle, 30);
  const healthIssues = text(body.healthIssues, 2_000);
  const medications = text(body.medications, 1_000);
  const language = body.language === 'en' ? 'en' : 'ar';
  const planId = text(body.selectedPlan?.id, 50);
  const planName = text(body.selectedPlan?.name, 150);
  const planDuration = text(body.selectedPlan?.duration, 100);
  const planPrice = numberInRange(body.selectedPlan?.priceSAR, 0, 100_000);

  const validLocations = ['home', 'gym', 'both'];
  const validLevels = ['beginner', 'intermediate', 'advanced'];
  const validLifestyles = ['office', 'active', 'student', 'housewife'];

  const isValid =
    age !== null &&
    height !== null &&
    weight !== null &&
    trainingDays !== null &&
    country.length >= 2 &&
    /^\+[1-9]\d{6,14}$/.test(phone) &&
    /^[A-Za-z0-9._]{1,30}$/.test(instagram) &&
    pathId.length > 0 &&
    pathName.length > 0 &&
    validLocations.includes(trainingLocation) &&
    validLevels.includes(experienceLevel) &&
    validLifestyles.includes(lifestyle) &&
    healthIssues.length > 0 &&
    medications.length > 0 &&
    planId.length > 0 &&
    planName.length > 0 &&
    planDuration.length > 0 &&
    planPrice !== null;

  if (!isValid) {
    return response({ success: false, message: 'Please review the submitted information' }, 400, responseOrigin);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL');
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Hanan Coaching <onboarding@resend.dev>';
  const ipSalt = Deno.env.get('IP_HASH_SALT');

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !notificationEmail || !ipSalt) {
    console.error('One or more required server secrets are missing.');
    return response({ success: false, message: 'Service is not configured' }, 503, responseOrigin);
  }

  const clientIp = (request.headers.get('x-forwarded-for') ?? request.headers.get('cf-connecting-ip') ?? 'unknown')
    .split(',')[0]
    .trim();
  const clientIpHash = await sha256(`${ipSalt}:${clientIp}`);
  const userAgent = text(request.headers.get('user-agent'), 500);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error: rateLimitError } = await supabase
    .from('registrations')
    .select('id', { count: 'exact', head: true })
    .eq('client_ip_hash', clientIpHash)
    .gte('created_at', tenMinutesAgo);

  if (rateLimitError) {
    console.error('Rate-limit query failed:', rateLimitError.message);
    return response({ success: false, message: 'Could not process the request' }, 500, responseOrigin);
  }

  if ((count ?? 0) >= 3) {
    return response({ success: false, message: 'Too many requests. Please try again later.' }, 429, responseOrigin);
  }

  const bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));
  const submittedAt = new Date().toISOString();
  const completeFormData = {
    age,
    country,
    phoneCountryCode,
    phoneCountryName,
    phone,
    instagram: `@${instagram}`,
    heightCm: height,
    weightKg: weight,
    bmi,
    pathId,
    pathName,
    trainingLocation,
    trainingLocationLabel: formatLocation(trainingLocation),
    experienceLevel,
    experienceLevelLabel: formatLevel(experienceLevel),
    trainingDays,
    lifestyle,
    lifestyleLabel: formatLifestyle(lifestyle),
    healthIssues,
    medications,
    selectedPlan: {
      id: planId,
      name: planName,
      priceSAR: planPrice,
      duration: planDuration,
    },
    language,
    submittedAt,
  };

  const { data: registration, error: insertError } = await supabase
    .from('registrations')
    .insert({
      form_data: completeFormData,
      residence_country: country,
      phone,
      instagram: `@${instagram}`,
      selected_plan: planName,
      client_ip_hash: clientIpHash,
      user_agent: userAgent,
      email_status: 'pending',
    })
    .select('id')
    .single();

  if (insertError || !registration) {
    console.error('Registration insert failed:', insertError?.message);
    return response({ success: false, message: 'Could not save the registration' }, 500, responseOrigin);
  }

  const emailText = [
    'طلب اشتراك جديد — موقع المدربة حنان خالد',
    '',
    `رقم الطلب: ${registration.id}`,
    `وقت الطلب: ${submittedAt}`,
    `الباقة: ${planName} — ${planPrice} ريال / ${planDuration}`,
    `رقم الواتساب: ${phone}`,
    `يوزر الإنستجرام: @${instagram}`,
    `دولة الإقامة: ${country}`,
    `دولة الهاتف: ${phoneCountryName} (${phoneCountryCode})`,
    `العمر: ${age}`,
    `الطول: ${height} سم`,
    `الوزن: ${weight} كغ`,
    `مؤشر BMI: ${bmi}`,
    `المسار: ${pathName}`,
    `مكان التدريب: ${formatLocation(trainingLocation)}`,
    `مستوى المتدربة: ${formatLevel(experienceLevel)}`,
    `أيام التدريب أسبوعياً: ${trainingDays}`,
    `نمط الحياة: ${formatLifestyle(lifestyle)}`,
    `المشاكل الصحية: ${healthIssues}`,
    `الأدوية: ${medications}`,
    `لغة النموذج: ${language === 'ar' ? 'العربية' : 'الإنجليزية'}`,
  ].join('\n');

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notificationEmail],
      subject: `طلب اشتراك جديد — ${planName}`,
      text: emailText,
      reply_to: notificationEmail,
    }),
  });

  if (!emailResponse.ok) {
    const emailError = (await emailResponse.text()).slice(0, 1_000);
    console.error('Email delivery failed:', emailError);
    await supabase
      .from('registrations')
      .update({ email_status: 'failed', email_error: emailError })
      .eq('id', registration.id);
  } else {
    await supabase
      .from('registrations')
      .update({ email_status: 'sent', email_error: null })
      .eq('id', registration.id);
  }

  return response({ success: true, registrationId: registration.id }, 200, responseOrigin);
});

