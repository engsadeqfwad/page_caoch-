import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  Phone, 
  AtSign, 
  Ruler, 
  Scale, 
  Send,
  AlertCircle,
  ChevronDown,
  Search
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { paths, pricingTiers } from '../data';
import SubscriptionTermsInfo from './SubscriptionTermsInfo';
import LanguageToggle from './LanguageToggle';
import WheelPicker from './WheelPicker';
import { useLang } from '../context/language';
import { phoneCountries, type PhoneCountry } from '../data/phoneCountries';
import WizardTopBar from './WizardTopBar';
import { REGISTRATION_LIMITS, REGISTRATION_PLANS, UUID_PATTERN, getBmiAnalysis, validateRegistration } from '../../supabase/functions/_shared/registration';
import { clearSubmissionAttempt, normalizePhoneInput, registrationStorage, sendRegistrationRequest, submissionIdFor } from '../lib/registration';

const SECURE_REGISTRATION_ENDPOINT = import.meta.env.VITE_REGISTRATION_ENDPOINT?.trim()
  || 'https://jajwrjblsbdfbhbrfyku.supabase.co/functions/v1/submit-registration';

interface WizardProps {
  onComplete?: () => void;
}

export default function WizardOnboarding({ onComplete }: WizardProps) {
  const { lang, t, dir } = useLang();
  const { planId: routePlanId } = useParams();
  const initialPlanId = routePlanId && Object.prototype.hasOwnProperty.call(REGISTRATION_PLANS, routePlanId) ? routePlanId : 'plus';
  const submitting = useRef(false);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const [registrationId, setRegistrationId] = useState('');

  // Main Step State
  const [step, setStep] = useState<'welcome' | 'questions' | 'recommendation' | 'success'>('welcome');
  const [qIndex, setQIndex] = useState(0);

  // Form Data State
  const [formData, setFormData] = useState({
    age: 24,
    country: '',
    height: 165,
    weight: 62,
    pathId: 'feminine-shape',
    trainingLocation: 'home',
    experienceLevel: 'beginner',
    trainingDays: 3,
    lifestyle: 'office',
    healthIssues: '',
    medications: '',
    phone: '',
    instagram: '',
    selectedPlanId: initialPlanId,
    website: '',
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Country Code Selection State
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(phoneCountries[0]);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const filteredCountries = phoneCountries.filter(
    (c) =>
      c.name.includes(countrySearch) ||
      c.nameEn.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const parsedPhone = formData.phone.trim()
    ? parsePhoneNumberFromString(formData.phone, selectedCountry.code)
    : undefined;
  const examplePhoneCountry = selectedCountry.exampleNational
    ? parsePhoneNumberFromString(selectedCountry.exampleNational, selectedCountry.code)?.country
    : selectedCountry.code;
  const isPhoneValid = Boolean(
    parsedPhone?.isValid() &&
    (parsedPhone.country === selectedCountry.code || parsedPhone.country === examplePhoneCountry)
  );
  const phonePreview = isPhoneValid && parsedPhone
    ? parsedPhone.formatInternational()
    : selectedCountry.exampleInternational;
  const phoneDigitCount = formData.phone.replace(/\D/g, '').length;
  const exampleDigitCount = selectedCountry.exampleNational.replace(/\D/g, '').length;
  const showPhoneError = phoneDigitCount >= exampleDigitCount && !isPhoneValid;

  // Handle BMI Calculation & Physical Need Breakdown
  const heightM = formData.height / 100;
  const bmiValue = parseFloat((formData.weight / (heightM * heightM)).toFixed(1));

  const bmiAnalysis = getBmiAnalysis(bmiValue);
  const bmiCategory = t(bmiAnalysis.category, bmiAnalysis.categoryEn);
  const bmiColor = bmiAnalysis.color;
  const physicalNeed = bmiAnalysis.physicalNeed;

  const isLowWeight = physicalNeed === 'weight-gain' || physicalNeed === 'moderate-gain';
  const isHighWeight = physicalNeed === 'fat-loss' || physicalNeed === 'high-fat-loss';
  const selectedPathObj = paths.find((p) => p.id === formData.pathId) || paths[0];

  let isMisaligned = false;
  let advisoryTitle = '';
  let advisoryMessage = '';

  if (isLowWeight && formData.pathId === 'fat-loss') {
    isMisaligned = true;
    advisoryTitle = t('⚠️ ملاحظة توجيهية هامة من التحليل البدني', '⚠️ Important Physical Analysis Advisory');
    advisoryMessage = t(
      `بناءً على طولكِ ووزنكِ الحالي (BMI: ${bmiValue} - ${bmiCategory})، اختياركِ لمسار «التنحيف والنحت» قد لا يتناسب تماماً مع كتلة جسمكِ الحالية التي تحتاج زيادة وزن وامتلاء وليس خفض دهون. ستراجع المدربة حنان خالد حالتكِ شخصياً لتوجيه خطتكِ بما يحقق التناسق والامتلاء المطلوبين بأمان.`,
      `Based on your height and current weight (BMI: ${bmiValue} - ${bmiCategory}), choosing the «Fat Loss & Sculpt» path may not align with your current body mass that needs weight gain and feminine fullness rather than fat reduction. Coach Hanan Khalid will personally review your case to guide your plan safely.`
    );
  } else if (isHighWeight && formData.pathId === 'weight-gain') {
    isMisaligned = true;
    advisoryTitle = t('⚠️ ملاحظة توجيهية هامة من التحليل البدني', '⚠️ Important Physical Analysis Advisory');
    advisoryMessage = t(
      `بناءً على طولكِ ووزنكِ الحالي (BMI: ${bmiValue} - ${bmiCategory})، اختياركِ لمسار «زيادة الوزن» قد لا يتناسب تماماً مع كتلة جسمكِ الحالية التي تحتاج خفض نسبة الدهون ونحت الجسم بدلاً من زيادة السعرات. ستراجع المدربة حنان خالد حالتكِ لتعديل خطتكِ نحو النحت وخسارة الدهون.`,
      `Based on your height and current weight (BMI: ${bmiValue} - ${bmiCategory}), choosing the «Weight Gain» path may not align with your current body mass that needs fat reduction and body sculpting instead of increasing calories. Coach Hanan Khalid will review your case to adjust your plan toward sculpting and fat loss.`
    );
  } else {
    isMisaligned = false;
    advisoryTitle = t('مراجعة أولية للمسار المختار', 'Initial Review of Your Selected Path');
    advisoryMessage = t(
      `اختياركِ لمسار «${selectedPathObj.title}» لا يظهر معه تعارض مبدئي وفق مؤشر كتلة جسمكِ الحالي (${bmiCategory})، وستراجع المدربة حالتكِ قبل إعداد البرنامج.`,
      `Your choice of the «${selectedPathObj.titleEn || selectedPathObj.subtitle}» path shows no initial conflict based on your current BMI (${bmiCategory}). Your coach will review your case before preparing your program.`
    );
  }

  // Scroll to top on any step/question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, qIndex]);

  const TOTAL_STEPS = 9;
  const currentStepNum = qIndex + 1;
  const progressPercent = Math.round((currentStepNum / TOTAL_STEPS) * 100);

  const handleNextQuestion = () => {
    setErrorMsg('');
    if (qIndex === 7 && (!formData.healthIssues.trim() || !formData.medications.trim())) {
      setErrorMsg(t('يرجى توضيح الحالة الصحية والأدوية (أو كتابة «لا يوجد»)', 'Please clarify your health conditions and medications (or write "None")'));
      return;
    }
    if (qIndex === 8) {
      if (formData.country.trim().length < 2) {
        setErrorMsg(t('يرجى إدخال دولة الإقامة قبل المتابعة', 'Please enter your country of residence before continuing'));
        return;
      }
      if (!isPhoneValid) {
        setErrorMsg(t(
          `يرجى إدخال رقم صحيح لدولة ${selectedCountry.name}، مثال: ${selectedCountry.exampleNational}`,
          `Please enter a valid ${selectedCountry.nameEn} number, for example: ${selectedCountry.exampleNational}`
        ));
        return;
      }
      if (!/^[A-Za-z0-9._]+$/.test(formData.instagram)) {
        setErrorMsg(t('يرجى إدخال يوزر إنستجرام صحيح بالأحرف الإنجليزية', 'Please enter a valid Instagram username using English characters'));
        return;
      }
      setStep('recommendation');
      return;
    }
    setQIndex((prev) => prev + 1);
  };

  const handlePrevQuestion = () => {
    setErrorMsg('');
    if (qIndex > 0) {
      setQIndex((prev) => prev - 1);
    } else {
      setStep('welcome');
    }
  };

  // Keep the same attempt ID after timeouts so a saved request is never inserted twice.
  const submitRegistration = async (planId: string) => {
    if (submitting.current) return;
    submitting.current = true;
    setLoadingSubmit(true);
    setErrorMsg('');
    const chosenTier = pricingTiers.find((tier) => tier.id === planId) || pricingTiers[0];
    const payload = {
      age: formData.age, country: formData.country.trim(),
      phoneCountryCode: selectedCountry.code, phoneCountryName: selectedCountry.name,
      phone: parsedPhone?.number || '', instagram: formData.instagram,
      height: formData.height, weight: formData.weight,
      pathId: formData.pathId, pathName: selectedPathObj.title,
      trainingLocation: formData.trainingLocation, experienceLevel: formData.experienceLevel,
      trainingDays: formData.trainingDays, lifestyle: formData.lifestyle,
      healthIssues: formData.healthIssues.trim(), medications: formData.medications.trim(),
      selectedPlan: { id: chosenTier.id, name: chosenTier.name, priceSAR: chosenTier.priceSAR, duration: chosenTier.duration },
      language: lang, website: formData.website,
    };
    let requestStarted = false;
    try {
      if (!isPhoneValid || !validateRegistration(payload).ok) {
        setErrorMsg(t('يرجى مراجعة الإجابات ووسائل التواصل قبل اعتماد الطلب.', 'Please review your answers and contact details before confirming.'));
        return;
      }
      const serialized = JSON.stringify(payload);
      const storage = registrationStorage();
      if (attempt.current?.payload !== serialized) {
        attempt.current = { payload: serialized, id: await submissionIdFor(payload, storage) };
      }
      requestStarted = true;
      const { response: res, result } = await sendRegistrationRequest(SECURE_REGISTRATION_ENDPOINT,
        { ...payload, submissionId: attempt.current.id });
      if (res.ok && result?.success === true && typeof result.registrationId === 'string' && UUID_PATTERN.test(result.registrationId)) {
        setRegistrationId(result.registrationId);
        setFormData((current) => ({ ...current, selectedPlanId: planId }));
        clearSubmissionAttempt(storage);
        setStep('success');
        window.scrollTo(0, 0);
        onComplete?.();
      } else if (res.status === 429) {
        setErrorMsg(t('وصلتِ إلى الحد المسموح من الطلبات. يرجى الانتظار عشر دقائق قبل المحاولة.', 'The submission limit has been reached. Please wait ten minutes before trying again.'));
      } else if (res.status === 400 || res.status === 415 || res.status === 413) {
        setErrorMsg(t('يرجى مراجعة البيانات المدخلة وأطوال النصوص ثم المحاولة مجدداً.', 'Please review your information and text lengths, then try again.'));
      } else if (res.status === 409) {
        attempt.current = null;
        clearSubmissionAttempt(storage);
        setErrorMsg(t('تغيرت بيانات المحاولة السابقة. يرجى اعتماد البيانات مرة أخرى.', 'The previous attempt has different details. Please confirm your information again.'));
      } else {
        setErrorMsg(t('تعذر تأكيد حفظ طلبكِ حالياً. يمكنكِ إعادة المحاولة بنفس البيانات.', 'We could not confirm your registration yet. You can retry with the same details.'));
      }
    } catch (error) {
      if (!requestStarted) {
        setErrorMsg(t('تعذر تجهيز الطلب على هذا المتصفح. حدّثي الصفحة ثم أعيدي المحاولة.', 'We could not prepare the request in this browser. Refresh the page and try again.'));
      } else if (error instanceof Error && error.name === 'TimeoutError') {
        setErrorMsg(t('انتهت مهلة انتظار تأكيد حفظ الطلب. أعيدي المحاولة بنفس البيانات لتأكيد النتيجة.', 'The confirmation timed out. Retry with the same details to confirm the result.'));
      } else {
        setErrorMsg(t('تعذر الاتصال بخدمة التسجيل لتأكيد النتيجة. أعيدي المحاولة بنفس البيانات.', 'We could not reach the registration service to confirm the result. Retry with the same details.'));
      }
    } finally {
      submitting.current = false;
      setLoadingSubmit(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER STEP 1: WELCOME SCREEN
  // -------------------------------------------------------------
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col justify-between px-4 py-6 relative overflow-hidden" dir={dir}>
        {/* Top Language Toggle */}
        <div className="w-full max-w-xl mx-auto flex justify-between items-center py-2 relative z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-gold uppercase">
              {t('المدربة حنان خالد', 'Coach Hanan Khalid')}
            </span>
          </div>
          <LanguageToggle />
        </div>

        {/* Glowing Ambient Radial Glow */}
        <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
        <div className="absolute inset-0 digital-grid-bg opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-xl w-full mx-auto text-center space-y-6 my-auto">
          
          {/* Header Logo */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-full p-1 border-2 border-gold/40 shadow-neon-gold bg-dark-900/80">
              <img src={logoImg} alt="Coach Hanan" className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">
              {t('د/ك : حنان خالد', 'Coach: Hanan Khalid')}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {t('خلينا نختار لكِ البرنامج والمسار الأنسب 🌸', "Let's Choose the Best Program & Path for You 🌸")}
          </h1>

          <p className="text-taupe text-sm md:text-base leading-relaxed max-w-md mx-auto font-medium">
            {t(
              'أجيبي عن أسئلة بسيطة، وسأستطيع من خلالها بناء خطة تغذية وبرنامج تدريبي مخصص لحالتكِ بدقة عالية ومفيدة جداً.',
              'Answer a few simple questions and we will build a personalized nutrition plan and training program tailored precisely to your situation.'
            )}
          </p>

          {/* Hero Feature Badge */}
          <div className="p-4 rounded-2xl bg-dark-900/90 border border-gold/30 shadow-luxury flex items-center justify-center gap-3 text-cream">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold font-bold">
              ⚡
            </div>
            <span className="text-sm font-bold">
              {t('خطة تمرين شاملة + تغذية مرنة مناسبة لهدفكِ', 'Comprehensive training plan + flexible nutrition tailored to your goal')}
            </span>
          </div>

          {/* Action CTA Button */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => setStep('questions')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold via-amber-500 to-gold text-dark-950 font-extrabold text-base md:text-lg shadow-neon-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {t('ابدئي الآن', 'Start Now')}
              {lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </button>
            <p className="text-xs text-taupe/70 font-medium">
              {t('✨ اطلعي على ملخص إجاباتكِ والباقات قبل اعتماد طلبكِ', '✨ Review your answers and available plans before confirming your registration')}
            </p>
          </div>

        </div>

        <div className="py-2 text-center text-[11px] text-taupe/60">
          {t('منظومة التدريب والتغذية الذكية © 2026', 'Smart Coaching & Nutrition System © 2026')}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP 3: RECOMMENDATION & PACKAGE SELECTION
  // -------------------------------------------------------------
  if (step === 'recommendation') {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col relative px-4 py-4" dir={dir}>
        {/* Top Header Bar without background */}
        <WizardTopBar
          onBack={() => {
            setStep('questions');
            setQIndex(8);
          }}
          stepLabel={t('التقييم الأولي واختيار الباقة 🎯', 'Initial Assessment & Plan Selection 🎯')}
          percent={100}
          showProgress={true}
          disabled={loadingSubmit}
        />

        <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto w-full px-2 py-6 space-y-8 flex-1">
          
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30">
              <Sparkles size={14} />
              {t('ملخص التقييم الأولي والباقات', 'Initial Assessment & Available Plans')}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {t('مسار', 'Path:')} <span className="gradient-text">«{lang === 'ar' ? selectedPathObj.title : (selectedPathObj.titleEn || selectedPathObj.subtitle)}»</span> 🎯
            </h1>
            <p className="text-taupe text-sm leading-relaxed max-w-xl mx-auto font-medium">
              {t(
                `بناءً على نتائج قياساتكِ البدنية (BMI: ${bmiValue} — ${bmiCategory}) وهدفكِ المحدد، يمكنكِ اختيار إحدى باقات المتابعة التالية، وتراجع المدربة تفاصيل حالتكِ:`,
                `Based on your physical measurements (BMI: ${bmiValue} — ${bmiCategory}) and your specified goal, you can choose a coaching package below. Your coach will review your details:`
              )}
            </p>
          </div>

          {/* Error Message if submit fails */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-sm text-center">
              {errorMsg}
            </div>
          )}

          {/* Pricing Tiers Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[...pricingTiers].sort((a, b) => Number(b.id === formData.selectedPlanId) - Number(a.id === formData.selectedPlanId)).map((tier) => (
              <div
                key={tier.id}
                className="p-6 md:p-8 rounded-3xl border relative flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(160deg, rgba(63,20,37,0.85) 0%, rgba(20,4,10,0.95) 100%)',
                  borderColor: 'rgba(186,120,92,0.5)',
                  boxShadow: '0 15px 40px rgba(186,120,92,0.15)',
                }}
              >
                <div>
                  {tier.id === formData.selectedPlanId && <p className="text-xs text-gold font-bold mb-2">{t('الباقة المحددة', 'Selected plan')}</p>}
                  <h3 className="text-xl font-extrabold text-white mb-2">
                    {lang === 'ar' ? tier.name : tier.nameEn}
                  </h3>
                  <p className="text-xs text-taupe mb-6 leading-relaxed font-medium">
                    {lang === 'en' && tier.descriptionEn ? tier.descriptionEn : tier.description}
                  </p>
                  
                  {/* Price Box */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black text-white">{tier.priceSAR}</span>
                      <span className="text-xs text-taupe font-bold mx-1">
                        {t('ريال سعودي', 'SAR')}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gold">{tier.priceUSD}$</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-8">
                    {(lang === 'en' && tier.featuresEn ? tier.featuresEn : tier.features).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-cream">
                        <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => submitRegistration(tier.id)}
                  disabled={loadingSubmit}
                  className="w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-gold via-amber-500 to-gold text-dark-950 shadow-neon-gold hover:opacity-95 active:scale-[0.98]"
                >
                  {loadingSubmit ? (
                    <span className="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      {t(`اختاري ${lang === 'ar' ? tier.name : tier.nameEn} واعتمدي بياناتكِ`, `Choose ${tier.nameEn} & Confirm`)}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Quick return to modify responses */}
          <div className="text-center pt-4">
            <button
              type="button"
              disabled={loadingSubmit}
              onClick={() => {
                setStep('questions');
                setQIndex(8);
              }}
              className="text-xs text-taupe hover:text-gold transition-colors inline-flex items-center gap-1.5 font-bold"
            >
              {lang === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{t('الرجوع لتعديل إجاباتكِ أو قياساتكِ', 'Go back to modify your answers or measurements')}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP 4: SUCCESS & DETAILED TERMS / INFO SCREEN
  // -------------------------------------------------------------
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-dark-950 py-12 px-4 relative" dir={dir}>
        <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-6">
          <Link to="/home" className="text-xs font-bold text-gold hover:underline">
            {t('← الانتقال للصفحة الرئيسية', '← Go to Homepage')}
          </Link>
          <LanguageToggle />
        </div>

        <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-center">
          
          {/* Confirmation Box */}
          <div className="p-8 md:p-10 rounded-3xl bg-dark-900/90 border border-gold/40 shadow-luxury space-y-5 max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 size={44} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {t('تم حفظ طلبكِ وأصبح تحت المراجعة! 🎉', 'Your registration has been saved and is under review! 🎉')}
            </h1>
            <p className={`text-taupe text-sm md:text-base leading-relaxed font-medium ${lang === 'en' ? 'text-left' : 'text-right'}`}>
              {t(
                `وصلتنا كافة بياناتكِ بنجاح. سيتم التواصل معكِ شخصياً خلال 24 ساعة عبر الواتساب (`,
                `All your data has been received successfully. You will be personally contacted within 24 hours via WhatsApp (`
              )}
              <span className="text-gold dir-ltr inline-block">{phonePreview}</span>
              {t(
                `) او الأنستجرام بواسطة المدربة `,
                `) or Instagram by Coach `
              )}
              <strong className="text-cream">{t('حنان خالد', 'Hanan Khalid')}</strong>
              {t(' لتزويدكِ ببقية التفاصيل ثم تزويدك بالنظام والبدء .', ' to provide you with the remaining details and start the program.')}
            </p>

            <p className="text-xs text-taupe break-all">
              {t('رقم الطلب: ', 'Registration ID: ')}<span dir="ltr">{registrationId}</span>
            </p>

            {/* Physical Alignment Note inside Success Box */}
            <div className={`p-4 rounded-2xl border space-y-1 text-xs md:text-sm font-medium ${lang === 'ar' ? 'text-right' : 'text-left'} ${
              isMisaligned
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            }`} dir={dir}>
              <div className="font-bold mb-1">{advisoryTitle}</div>
              <p className="leading-relaxed opacity-90">{advisoryMessage}</p>
            </div>
          </div>

          {/* Full Informational Section */}
          <SubscriptionTermsInfo />

          {/* CTA Button to Navigate to Homepage */}
          <div className="pt-8 pb-12 text-center">
            <Link
              to="/home"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-gold via-amber-500 to-gold text-dark-950 font-extrabold text-base md:text-lg shadow-neon-gold hover:scale-105 transition-all"
            >
              {t('الانتقال للصفحة الرئيسية واستكشاف باقي التفاصيل', 'Go to Homepage & Explore More')}
              {lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP 5: QUESTIONNAIRE WIZARD (7 QUESTIONS)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col px-4 py-3 relative" dir={dir}>
      {/* Sleek Natural Top Bar (Without background or border) */}
      <WizardTopBar
        onBack={handlePrevQuestion}
        stepLabel={t(`الخطوة ${currentStepNum} من ${TOTAL_STEPS}`, `Step ${currentStepNum} of ${TOTAL_STEPS}`)}
        percent={progressPercent}
        showProgress={true}
      />
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
      <div className="absolute inset-0 digital-grid-bg opacity-15 pointer-events-none" />

      {/* Main Question Card Container with Action Button Directly Below Fields */}
      <div className="relative z-10 max-w-2xl mx-auto w-full my-auto px-2 py-4">
        
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs md:text-sm flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Keep the bot-only field out of layout: off-screen positioning expands RTL mobile scroll bounds. */}
        <div hidden aria-hidden="true">
          <label htmlFor="registration-website">Website</label>
          <input id="registration-website" name="website" type="text" tabIndex={-1} autoComplete="off"
            value={formData.website} onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))} />
        </div>

        {/* QUESTION 0: Age */}
        {qIndex === 0 && (
          <div className="space-y-5 md:space-y-7">
            <div className="text-center md:text-start">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('كم عمركِ؟', 'How old are you?')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('اختاري عمركِ بالسحب للأعلى أو للأسفل.', 'Swipe up or down to select your age.')}
              </p>
            </div>

            <div className="max-w-sm mx-auto w-full">
              <WheelPicker
                value={formData.age}
                min={REGISTRATION_LIMITS.age.min}
                max={REGISTRATION_LIMITS.age.max}
                onChange={(age) => setFormData((current) => ({ ...current, age }))}
                unit={t('سنة', 'years')}
                ariaLabel={t('اختيار العمر', 'Select age')}
              />
            </div>
          </div>
        )}

        {/* QUESTION 1: Height & Weight */}
        {qIndex === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('كم طولكِ ووزنكِ الحالي؟', 'What is your current height and weight?')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('هذه المعلومة لحساب مؤشر كتلة الجسم (BMI) وتخصيص خطتكِ الفردية.', 'This information is used to calculate your BMI and personalize your individual plan.')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-5">
              <div className="min-w-0 space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-bold text-cream">
                  <Ruler size={16} className="text-gold" />
                  <span>{t('الطول', 'Height')}</span>
                </div>
                <WheelPicker
                  compact
                  value={formData.height}
                  min={REGISTRATION_LIMITS.height.min}
                  max={REGISTRATION_LIMITS.height.max}
                  onChange={(height) => setFormData((current) => ({ ...current, height }))}
                  unit={t('سم', 'cm')}
                  ariaLabel={t('اختيار الطول', 'Select height')}
                />
              </div>

              <div className="min-w-0 space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-bold text-cream">
                  <Scale size={16} className="text-rose-300" />
                  <span>{t('الوزن الحالي', 'Current Weight')}</span>
                </div>
                <WheelPicker
                  compact
                  value={formData.weight}
                  min={REGISTRATION_LIMITS.weight.min}
                  max={REGISTRATION_LIMITS.weight.max}
                  onChange={(weight) => setFormData((current) => ({ ...current, weight }))}
                  unit={t('كجم', 'kg')}
                  ariaLabel={t('اختيار الوزن', 'Select weight')}
                />
              </div>
            </div>

            {/* Calculated BMI Card */}
            <div className="p-5 rounded-2xl bg-dark-900/90 border border-gold/30 text-center space-y-1 shadow-luxury">
              <div className="text-xs font-bold text-taupe">{t('مؤشر كتلة الجسم (BMI)', 'Body Mass Index (BMI)')}</div>
              <div className="text-4xl font-black text-white">{bmiValue}</div>
              <div className={`text-sm font-bold ${bmiColor}`}>{bmiCategory}</div>
            </div>
          </div>
        )}

        {/* QUESTION 2: Goal & Path Selection */}
        {qIndex === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('ما هو هدفكِ الرئيسي؟ 🎯', 'What is your main goal? 🎯')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('اختاري المسار الأقرب لهدفكِ الحالي لضبط التغذية والتمارين بناءً عليه.', 'Choose the path closest to your current goal to customize your nutrition and training accordingly.')}
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {paths.map((p) => {
                const isSelected = formData.pathId === p.id;
                const isRecommendedForBody = 
                  (isLowWeight && (p.id === 'weight-gain' || p.id === 'feminine-shape')) ||
                  (isHighWeight && (p.id === 'fat-loss' || p.id === 'recomposition'));

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, pathId: p.id })}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      isSelected
                        ? 'bg-gold/15 border-gold shadow-neon-gold text-white'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sm text-white">
                          {lang === 'ar' ? p.title : (p.titleEn || p.subtitle)}
                        </span>
                        {isRecommendedForBody && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                            {t('✨ موصى به لكتلة جسمكِ', '✨ Recommended for your body')}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-taupe/90 font-medium leading-relaxed">
                        {lang === 'en' && p.descriptionEn ? p.descriptionEn : p.description}
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 mx-2 ${isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'}`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 3: Training Location */}
        {qIndex === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('أين تفضلين ممارسة التمارين الرياضية؟ 🏋️‍♀️', 'Where do you prefer to exercise? 🏋️‍♀️')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('المنظومة تدعم الخيارين (البيت أو النادي) بنفس الكفاءة والشروحات.', 'The program supports both options (home or gym) with equal efficiency and instructions.')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'home', icon: '🏠', titleAr: 'في المنزل', titleEn: 'At Home', descAr: 'أدوات بسيطة أو وزن الجسم', descEn: 'Simple equipment or bodyweight' },
                { id: 'gym', icon: '🏋️‍♀️', titleAr: 'في الجيم', titleEn: 'At the Gym', descAr: 'أجهزة وأوزان النادي', descEn: 'Gym machines and weights' },
                { id: 'both', icon: '🔄', titleAr: 'المنزل والجيم معاً', titleEn: 'Home & Gym', descAr: 'خطة مرنة تتكيف مع المكانين', descEn: 'A flexible plan for both locations' },
              ].map((loc) => {
                const isSelected = formData.trainingLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, trainingLocation: loc.id })}
                    className={`w-full p-4 md:p-5 rounded-2xl border transition-all flex items-center gap-4 ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-white shadow-neon-gold'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">{loc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-base md:text-lg font-bold text-white">
                        {lang === 'ar' ? loc.titleAr : loc.titleEn}
                      </div>
                      <div className="text-xs text-taupe/80 font-medium mt-1">
                        {lang === 'ar' ? loc.descAr : loc.descEn}
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'}`}>
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 4: Experience Level */}
        {qIndex === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('ما هو مستواكِ الحالي في التدريب؟', 'What is your current training level?')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('اختاري المستوى الأقرب لخبرتكِ حتى نبدأ بدرجة مناسبة وآمنة.', 'Choose the level closest to your experience so we can start safely and effectively.')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'beginner', icon: '🌱', labelAr: 'مبتدئة', labelEn: 'Beginner', descAr: 'بداية جديدة أو خبرة بسيطة', descEn: 'New start or limited experience' },
                { id: 'intermediate', icon: '✨', labelAr: 'متوسطة', labelEn: 'Intermediate', descAr: 'لديكِ خبرة وانتظام سابق', descEn: 'Some experience and prior consistency' },
                { id: 'advanced', icon: '⚡', labelAr: 'متقدمة', labelEn: 'Advanced', descAr: 'خبرة جيدة بالتمارين والأوزان', descEn: 'Strong experience with training and weights' },
              ].map((level) => {
                const isSelected = formData.experienceLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, experienceLevel: level.id })}
                    className={`w-full p-4 md:p-5 rounded-2xl border transition-all flex items-center gap-4 ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      isSelected ? 'bg-gold/15 border-gold shadow-neon-gold' : 'bg-dark-900/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">{level.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white">{lang === 'ar' ? level.labelAr : level.labelEn}</div>
                      <div className="text-xs text-taupe mt-1">{lang === 'ar' ? level.descAr : level.descEn}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'}`}>
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 5: Training Days */}
        {qIndex === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('كم يوماً تستطيعين التمرين أسبوعياً؟', 'How many days can you train each week?')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('اختاري عدداً واقعياً يمكنكِ الالتزام به باستمرار.', 'Choose a realistic schedule you can maintain consistently.')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[2, 3, 4, 5].map((days) => {
                const isSelected = formData.trainingDays === days;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setFormData({ ...formData, trainingDays: days })}
                    className={`min-h-28 p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${
                      isSelected ? 'bg-gold/15 border-gold shadow-neon-gold' : 'bg-dark-900/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className={`text-3xl font-black ${isSelected ? 'text-gold' : 'text-white'}`}>{days}</span>
                    <span className="text-xs md:text-sm font-bold text-cream">
                      {days === 2 ? t('يومان أسبوعياً', 'days per week') : t('أيام أسبوعياً', 'days per week')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 6: Lifestyle & Activity */}
        {qIndex === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('صفّي طبيعة نشاطكِ ويومكِ اليومي', 'Describe your daily activity level')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('تساعد هذه المعلومة المدربة على تقدير نشاطكِ واحتياجاتكِ عند مراجعة الطلب.', 'This helps your coach assess your activity and needs when reviewing your registration.')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'office', labelAr: '💼 عمل مكتبي — جلوس معظم اليوم', labelEn: '💼 Office work — Sitting most of the day' },
                { id: 'active', labelAr: '🚶‍♀️ حركة كثيرة — وقوف وتنقل مستمر', labelEn: '🚶‍♀️ Very active — Standing and moving constantly' },
                { id: 'student', labelAr: '📚 دراسة ومشي كثير', labelEn: '📚 Studying with a lot of walking' },
                { id: 'housewife', labelAr: '🏠 ربة منزل نشطة', labelEn: '🏠 Active homemaker' },
              ].map((opt) => {
                const isSelected = formData.lifestyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, lifestyle: opt.id })}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-white shadow-neon-gold'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <span className="font-bold text-sm text-white">
                      {lang === 'ar' ? opt.labelAr : opt.labelEn}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'}`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 7: Health Issues & Medications */}
        {qIndex === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('الاعتبارات الصحية والأدوية 🩺', 'Health Considerations & Medications 🩺')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('نراعي أدق التفاصيل لضمان نظام صحي آمن تماماً لصحتكِ.', 'We consider every detail to ensure a 100% safe and therapeutic plan for you.')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cream mb-2">
                  {t('هل تعانين من أي مشاكل صحية؟', 'Do you have any health conditions?')}
                </label>
                <textarea
                  rows={3}
                  maxLength={REGISTRATION_LIMITS.healthIssues}
                  value={formData.healthIssues}
                  onChange={(e) => setFormData({ ...formData, healthIssues: e.target.value })}
                  placeholder={t('مثال: تكيسات مبايض، خمول غدة، قولون عصبي... (إذا لا يوجد اكتبي: لا يوجد)', 'e.g., PCOS, hypothyroidism, IBS... (If none, write: None)')}
                  className="form-input w-full text-sm resize-none"
                  dir="auto"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cream mb-2">
                  {t('هل تستهلكين أي أدوية حالياً؟', 'Are you currently taking any medications?')}
                </label>
                <input
                  type="text"
                  maxLength={REGISTRATION_LIMITS.medications}
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder={t('اذكري اسم الدواء أو اكتبي «لا يوجد»', 'Mention the medication name or write "None"')}
                  className="form-input w-full text-sm"
                  dir="auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* QUESTION 8: Country + Contact Info */}
        {qIndex === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('وسائل التواصل المباشرة 📱', 'Direct Contact Information 📱')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('أدخلي دولة الإقامة ووسائل التواصل بدقة لتتواصل معكِ المدربة حنان خالد.', 'Enter your country of residence and contact details accurately so Coach Hanan Khalid can reach you.')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cream mb-2">
                  {t('الدولة التي تقيمين فيها', 'Country of residence')} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  maxLength={REGISTRATION_LIMITS.country}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder={t('مثال: السعودية، الإمارات، الكويت...', 'e.g., Saudi Arabia, UAE, Kuwait...')}
                  className={`form-input w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                  dir={dir}
                  autoComplete="country-name"
                />
              </div>

              {/* Phone / WhatsApp with Modern Country Picker & Search */}
              <div>
                <label className="block text-xs font-bold text-cream mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-emerald-400" />
                    {t('رقم الواتساب / الجوال', 'WhatsApp / Phone Number')} <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-xs text-taupe font-medium">
                    {selectedCountry.flag} {lang === 'ar' ? selectedCountry.name : selectedCountry.nameEn} ({selectedCountry.dialCode})
                  </span>
                </label>

                <div className="relative flex items-center gap-2">
                  {/* Country Selector Dropdown Trigger Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryMenu(!showCountryMenu)}
                      className="h-12 px-3 rounded-2xl bg-dark-900 border border-white/20 hover:border-gold/50 flex items-center gap-2 text-white font-bold text-sm transition-all"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-xs font-bold text-gold dir-ltr">{selectedCountry.dialCode}</span>
                      <ChevronDown size={14} className={`text-taupe transition-transform ${showCountryMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu Popup with Realtime Search Filter */}
                    {showCountryMenu && (
                      <div className="absolute top-full right-0 mt-2 w-64 max-h-64 rounded-2xl bg-dark-900 border border-gold/40 shadow-luxury z-50 p-2 flex flex-col">
                        <div className="p-1.5 mb-2 border-b border-white/10 flex items-center gap-2 bg-dark-950 rounded-xl px-2.5">
                          <Search size={14} className="text-taupe shrink-0" />
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder={t('ابحثي عن الدولة...', 'Search country...')}
                            className="bg-transparent text-xs text-white p-1 w-full outline-none font-medium"
                            dir="auto"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto space-y-1 max-h-48 pr-1">
                          {filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setFormData((current) => ({ ...current, phone: '' }));
                                setShowCountryMenu(false);
                                setCountrySearch('');
                                setErrorMsg('');
                              }}
                              className={`w-full text-right px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${
                                selectedCountry.code === c.code ? 'bg-gold/20 text-gold' : 'hover:bg-white/10 text-white'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-base">{c.flag}</span>
                                <span>{lang === 'ar' ? c.name : c.nameEn}</span>
                              </span>
                              <span className="text-gold font-bold dir-ltr">{c.dialCode}</span>
                            </button>
                          ))}
                          {filteredCountries.length === 0 && (
                            <p className="text-xs text-taupe text-center py-4">
                              {t('لم نجد دولة بهذا الاسم', 'No country found with this name')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Input Box */}
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: normalizePhoneInput(e.target.value) })}
                    placeholder={selectedCountry.exampleNational}
                    className={`form-input flex-1 min-w-0 text-base font-bold dir-ltr ${showPhoneError ? 'border-rose-500/60' : ''}`}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>

                <div className="mt-1.5 text-[11px] font-medium">
                  {showPhoneError ? (
                    <span className="text-rose-300">
                      {t(`أدخلي رقماً محلياً صحيحاً، مثال: ${selectedCountry.exampleNational}`, `Enter a valid local number, for example: ${selectedCountry.exampleNational}`)}
                    </span>
                  ) : isPhoneValid ? (
                    <span className="text-taupe/70">
                      {t('سيتم التواصل الفوري عبر الواتساب على الرقم المفعل كـ: ', 'You will be contacted on WhatsApp as: ')}
                      <span className="text-gold font-bold dir-ltr inline-block">{phonePreview}</span>
                    </span>
                  ) : (
                    <span className="text-taupe/70">
                      {t('اكتبي الرقم المحلي مثل: ', 'Enter the local number like: ')}
                      <span className="text-cream font-bold dir-ltr inline-block">{selectedCountry.exampleNational}</span>
                      <span>{t(' — وسيظهر دولياً كـ: ', ' — it will appear internationally as: ')}</span>
                      <span className="text-gold font-bold dir-ltr inline-block">{selectedCountry.exampleInternational}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-cream mb-2 flex items-center gap-1.5">
                  <AtSign size={14} className="text-rose-400" />
                  {t('يوزر الإنستجرام الخاص بكِ', 'Your Instagram Username')} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe font-bold text-sm">@</span>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => {
                      const instagram = e.target.value
                        .replace(/^@+/, '')
                        .replace(/[^A-Za-z0-9._]/g, '')
                        .slice(0, 30);
                      setFormData({ ...formData, instagram });
                    }}
                    placeholder="username"
                    className="form-input w-full pr-9"
                    dir="ltr"
                    autoComplete="off"
                  />
                </div>
                <span className="text-[11px] text-taupe/70 mt-1.5 block">
                  {t('يُسمح بالحروف الإنجليزية والأرقام والنقطة والشرطة السفلية فقط.', 'Only English letters, numbers, periods, and underscores are allowed.')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action CTA Button: Placed directly below the fields in the same container, responsive to empty space */}
        <div className="pt-8 pb-4">
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold via-amber-500 to-gold text-dark-950 font-extrabold text-base md:text-lg shadow-neon-gold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {qIndex === 8
              ? t('إظهار التوصية والنتيجة ✨', 'Show Recommendation & Result ✨')
              : t('متابعة', 'Continue')
            }
            {lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>

      </div>

    </div>
  );
}
