import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { useLang } from '../context/LanguageContext';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xljdlwvy';

export interface CountryCode {
  name: string;
  nameEn: string;
  dialCode: string;
  flag: string;
}

const countryList: CountryCode[] = [
  { name: 'السعودية', nameEn: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { name: 'الإمارات', nameEn: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'الكويت', nameEn: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { name: 'قطر', nameEn: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { name: 'البحرين', nameEn: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { name: 'عمان', nameEn: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { name: 'مصر', nameEn: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { name: 'الأردن', nameEn: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
  { name: 'العراق', nameEn: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
  { name: 'المغرب', nameEn: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { name: 'الجزائر', nameEn: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { name: 'تونس', nameEn: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { name: 'لبنان', nameEn: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
  { name: 'سوريا', nameEn: 'Syria', dialCode: '+963', flag: '🇸🇾' },
  { name: 'فلسطين', nameEn: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
  { name: 'اليمن', nameEn: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
  { name: 'السودان', nameEn: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
  { name: 'ليبيا', nameEn: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { name: 'تركيا', nameEn: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { name: 'موريتانيا', nameEn: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { name: 'الصومال', nameEn: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
  { name: 'المملكة المتحدة', nameEn: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { name: 'الولايات المتحدة', nameEn: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { name: 'كندا', nameEn: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { name: 'ألمانيا', nameEn: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { name: 'فرنسا', nameEn: 'France', dialCode: '+33', flag: '🇫🇷' },
  { name: 'إسبانيا', nameEn: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { name: 'إيطاليا', nameEn: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { name: 'السويد', nameEn: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { name: 'النرويج', nameEn: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { name: 'ماليزيا', nameEn: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
];

interface WizardProps {
  onComplete?: () => void;
}

export default function WizardOnboarding({ onComplete }: WizardProps) {
  const { lang, t, dir } = useLang();

  // Main Step State
  const [step, setStep] = useState<'welcome' | 'questions' | 'calculating' | 'recommendation' | 'success'>('welcome');
  const [qIndex, setQIndex] = useState(0);

  // Form Data State
  const [formData, setFormData] = useState({
    age: 24,
    country: '',
    height: 165,
    weight: 62,
    pathId: 'feminine-shape',
    trainingLocation: 'home',
    fitnessLevel: 'intermediate',
    workoutDaysPerWeek: '3',
    lifestyle: 'office',
    healthIssues: 'لا يوجد',
    medications: 'لا يوجد',
    phone: '',
    instagram: '',
    selectedPlanId: 'plus',
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [calcProgress, setCalcProgress] = useState(15);
  const [checkState, setCheckState] = useState([false, false, false, false]);

  // Country Code Selection State
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryList[0]);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const filteredCountries = countryList.filter(
    (c) =>
      c.name.includes(countrySearch) ||
      c.nameEn.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch)
  );

  // Handle BMI Calculation & Physical Need Breakdown
  const heightM = formData.height / 100;
  const bmiValue = parseFloat((formData.weight / (heightM * heightM)).toFixed(1));

  let bmiCategory = t('وزن طبيعي ومثالي', 'Normal & Ideal Weight');
  let bmiColor = 'text-emerald-400';
  let physicalNeed: 'weight-gain' | 'moderate-gain' | 'ideal' | 'fat-loss' | 'high-fat-loss' = 'ideal';

  if (bmiValue < 18.5) {
    bmiCategory = t('نقص في الوزن (يحتاج زيادة امتلاء أنثوي)', 'Underweight (Needs feminine fullness & weight gain)');
    bmiColor = 'text-amber-400';
    physicalNeed = 'weight-gain';
  } else if (bmiValue >= 18.5 && bmiValue <= 21.0) {
    bmiCategory = t('متوسط (يحتاج زيادة وزن قليلة وامتلاء أنثوي)', 'Average (Needs slight weight gain & feminine fullness)');
    bmiColor = 'text-amber-300';
    physicalNeed = 'moderate-gain';
  } else if (bmiValue > 21.0 && bmiValue < 25.0) {
    bmiCategory = t('وزن طبيعي ومثالي', 'Normal & Ideal Weight');
    bmiColor = 'text-emerald-400';
    physicalNeed = 'ideal';
  } else if (bmiValue >= 25.0 && bmiValue < 30.0) {
    bmiCategory = t('زيادة بسيطة في الوزن (يحتاج نحت وتنحيف)', 'Slight Overweight (Needs sculpting & fat loss)');
    bmiColor = 'text-amber-300';
    physicalNeed = 'fat-loss';
  } else if (bmiValue >= 30.0) {
    bmiCategory = t('زيادة ملحوظة / سمنة (يحتاج خفض دهون ونحت)', 'Overweight / Obesity (Needs fat reduction & sculpting)');
    bmiColor = 'text-rose-400';
    physicalNeed = 'high-fat-loss';
  }

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
    advisoryTitle = t('✅ توافق ممتاز مع التحليل البدني', '✅ Excellent Match with Physical Analysis');
    advisoryMessage = t(
      `اختياركِ لمسار «${selectedPathObj.title}» متوافق تماماً مع مؤشر كتلة جسمكِ الحالي (${bmiCategory})، وسيقوم النظام بتفصيل احتياجكِ بناءً عليه.`,
      `Your choice of the «${selectedPathObj.titleEn || selectedPathObj.subtitle}» path aligns smoothly with your current BMI (${bmiCategory}). The program will be tailored to your goals accordingly.`
    );
  }

  // Scroll to top on any step/question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, qIndex]);

  // Calculation Screen Simulation Effect
  useEffect(() => {
    if (step === 'calculating') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const timer1 = setTimeout(() => setCalcProgress(45), 400);
      const timer2 = setTimeout(() => {
        setCalcProgress(78);
        setCheckState([true, true, false, false]);
      }, 900);
      const timer3 = setTimeout(() => {
        setCalcProgress(94);
        setCheckState([true, true, true, false]);
      }, 1500);
      const timer4 = setTimeout(() => {
        setCalcProgress(100);
        setCheckState([true, true, true, true]);
      }, 2100);
      const timer5 = setTimeout(() => {
        setStep('recommendation');
      }, 2600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [step]);

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
      if (!formData.country.trim()) {
        setErrorMsg(t('يرجى تحديد الدولة التي تقيمين فيها', 'Please specify your country of residence'));
        return;
      }
      if (!formData.phone.trim() || formData.phone.length < 8) {
        setErrorMsg(t('يرجى إدخال رقم الواتساب بشكل صحيح لكي نستطيع التواصل معكِ', 'Please enter a valid WhatsApp number so we can contact you'));
        return;
      }
      if (!formData.instagram.trim()) {
        setErrorMsg(t('يرجى إدخال حساب الإنستجرام الخاص بكِ', 'Please enter your Instagram username'));
        return;
      }
      setStep('calculating');
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

  // Submit to Formspree
  const submitRegistration = async (planId: string) => {
    setLoadingSubmit(true);
    setErrorMsg('');
    const chosenTier = pricingTiers.find((t) => t.id === planId) || pricingTiers[0];
    const chosenPath = paths.find((p) => p.id === formData.pathId)?.title || formData.pathId;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          باقة_الاشتراك: `${chosenTier.name} — ${chosenTier.priceSAR} ريال / ${chosenTier.duration}`,
          رقم_الواتساب: `${selectedCountry.dialCode} ${formData.phone.trim()}`,
          يوزر_الانستجرام: `@${formData.instagram.replace('@', '')}`,
          العمر: `${formData.age} سنة`,
          الدولة: formData.country,
          الطول_سم: `${formData.height} سم`,
          الوزن_كغ: `${formData.weight} كجم`,
          مؤشر_BMI: `${bmiValue} (${bmiCategory})`,
          توافق_المسار_مع_البدن: isMisaligned ? '⚠️ تحذير: المسار المختار لا يتناسب مع كتلة الجسم وتلزم المراجعة' : '✅ متوافق تماماً مع كتلة الجسم',
          المسار_المختار: chosenPath,
          مكان_التدريب: formData.trainingLocation === 'home' ? '🏠 المنزل' : formData.trainingLocation === 'gym' ? '🏋️‍♀️ الجيم' : '🔄 المنزل والجيم معاً',
          المستوى: formData.fitnessLevel === 'beginner' ? 'مبتدئة' : formData.fitnessLevel === 'advanced' ? 'متقدمة' : 'متوسطة',
          أيام_التمرين_أسبوعياً: `${formData.workoutDaysPerWeek} أيام أسبوعياً`,
          المشاكل_الصحية: formData.healthIssues,
          الأدوية: formData.medications,
          نمط_الحياة: formData.lifestyle,
          اللغة_المستخدمة: lang === 'ar' ? 'العربية' : 'الإنجليزية',
          وقت_الطلب_الفعلي: new Date().toLocaleString('ar-EG', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        }),
      });

      if (res.ok) {
        setFormData({ ...formData, selectedPlanId: planId });
        setStep('success');
        window.scrollTo(0, 0);
        if (onComplete) onComplete();
      } else {
        setErrorMsg(t('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.', 'An error occurred while submitting. Please try again.'));
      }
    } catch {
      setErrorMsg(t('تعذر الاتصال بالسيرفر. يرجى التحقق من اتصال الإنترنت.', 'Could not connect to the server. Please check your internet connection.'));
    } finally {
      setLoadingSubmit(false);
    }
  };

  // -------------------------------------------------------------
  // REUSABLE TOP BAR (Natural transparent header blending into the page background)
  // -------------------------------------------------------------
  const WizardTopBar = ({ 
    onBack, 
    stepLabel, 
    percent,
    showProgress = true 
  }: { 
    onBack: () => void; 
    stepLabel: string; 
    percent: number;
    showProgress?: boolean;
  }) => (
    <div className="relative z-20 max-w-2xl mx-auto w-full pt-4 pb-2">
      <div className="flex items-center justify-between text-xs text-taupe mb-2.5 font-bold">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {lang === 'ar' ? <ArrowRight size={16} className="text-gold" /> : <ArrowLeft size={16} className="text-gold" />}
          <span>{t('السابق', 'Back')}</span>
        </button>

        {/* Step Status and Counter in Center */}
        <span className="text-xs md:text-sm font-bold text-white/90">
          {stepLabel}
        </span>

        {/* Progress % and Language Toggle */}
        <div className="flex items-center gap-3">
          {showProgress && (
            <span className="text-xs font-extrabold text-gold">
              {percent}%
            </span>
          )}
          <LanguageToggle />
        </div>
      </div>

      {/* Progress Track Line */}
      {showProgress && (
        <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-gold to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );

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
              {t('✨ النتيجة والتوصية تظهر لكِ مباشرة قبل تأكيد الدفع', '✨ Results and recommendations appear directly before payment confirmation')}
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
  // RENDER STEP 2: CALCULATING ANIMATION SCREEN
  // -------------------------------------------------------------
  if (step === 'calculating') {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col justify-between px-4 py-8 relative" dir={dir}>
        <div className="w-full max-w-md mx-auto flex justify-end">
          <LanguageToggle />
        </div>

        <div className="absolute inset-0 bg-dark-radial" />
        <div className="relative z-10 max-w-md w-full mx-auto text-center space-y-8 my-auto">
          
          <div className="text-6xl md:text-7xl font-black gradient-text animate-pulse">
            {calcProgress}%
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {t('جاري تحليل بياناتكِ وتجهيز خطتكِ...', 'Analyzing your data and preparing your plan...')}
            </h2>
            <p className="text-xs text-taupe">
              {t('نعمل على صياغة التوصية التغذوية والتدريبية المناسبة', 'We are formulating the appropriate nutrition and training recommendation')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-gold to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${calcProgress}%` }}
            />
          </div>

          {/* Dynamic Checklist */}
          <div className={`space-y-3 bg-dark-900/60 p-5 rounded-2xl border border-white/10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            {[
              { labelAr: 'تحليل إجاباتكِ والبيانات البدنية', labelEn: 'Analyzing your answers and physical data' },
              { labelAr: 'حساب مؤشر كتلة الجسم (BMI)', labelEn: 'Calculating BMI index' },
              { labelAr: 'تحديد مسار التغذية والتمارين المناسب', labelEn: 'Determining suitable nutrition and training path' },
              { labelAr: 'تجهيز توصية الخطة والباقة النهائية', labelEn: 'Preparing the plan recommendation and final package' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${checkState[idx] ? 'bg-gold text-dark-950' : 'border border-taupe/40 text-transparent'}`}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className={checkState[idx] ? 'text-white font-bold' : 'text-taupe/60'}>
                  {lang === 'ar' ? item.labelAr : item.labelEn}
                </span>
              </div>
            ))}
          </div>

        </div>

        <div className="py-2" />
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
          stepLabel={t('النتيجة والتوصية النهائية 🎯', 'Final Result & Recommendation 🎯')}
          percent={100}
          showProgress={true}
        />

        <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto w-full px-2 py-6 space-y-8 flex-1">
          
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30">
              <Sparkles size={14} />
              {t('نتيجة التحليل وتوصية البرنامج', 'Analysis Result & Program Recommendation')}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {t('مسار', 'Path:')} <span className="gradient-text">«{lang === 'ar' ? selectedPathObj.title : (selectedPathObj.titleEn || selectedPathObj.subtitle)}»</span> 🎯
            </h1>
            <p className="text-taupe text-sm leading-relaxed max-w-xl mx-auto font-medium">
              {t(
                `بناءً على نتائج قياساتكِ البدنية (BMI: ${bmiValue} — ${bmiCategory}) وهدفكِ المحدد، صممنا لكِ باقات المتابعة التالية:`,
                `Based on your physical measurements (BMI: ${bmiValue} — ${bmiCategory}) and your specified goal, we tailored the following coaching packages:`
              )}
            </p>
          </div>

          {/* Physical Need & Path Alignment Advisory Banner Card */}
          <div className={`p-5 rounded-2xl border max-w-xl mx-auto space-y-2 shadow-luxury ${lang === 'ar' ? 'text-right' : 'text-left'} ${
            isMisaligned 
              ? 'bg-amber-950/90 border-amber-500/60 text-amber-200' 
              : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
          }`} dir={dir}>
            <div className="font-extrabold text-sm md:text-base flex items-center gap-2">
              <span>{advisoryTitle}</span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed font-medium opacity-95">
              {advisoryMessage}
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
            {pricingTiers.map((tier) => (
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
              {t('تم إرسال بياناتكِ وأصبحت حالياً تحت المراجعة! 🎉', 'Your data has been submitted and is now under review! 🎉')}
            </h1>
            <p className={`text-taupe text-sm md:text-base leading-relaxed font-medium ${lang === 'en' ? 'text-left' : 'text-right'}`}>
              {t(
                `وصلتنا كافة بياناتكِ بنجاح. سيتم التواصل معكِ شخصياً خلال 24 ساعة عبر الواتساب (`,
                `All your data has been received successfully. You will be personally contacted within 24 hours via WhatsApp (`
              )}
              <span className="text-gold dir-ltr inline-block">{formData.phone}</span>
              {t(
                `) او الأنستجرام بواسطة المدربة `,
                `) or Instagram by Coach `
              )}
              <strong className="text-cream">{t('حنان خالد', 'Hanan Khalid')}</strong>
              {t(' لتزويدكِ ببقية التفاصيل ثم تزويدك بالنظام والبدء .', ' to provide you with the remaining details and start the program.')}
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

        {/* QUESTION 0: Age — Smooth Wheel Picker */}
        {qIndex === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('كم عمركِ؟ 🎂', 'How old are you? 🎂')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('لملاءمة شدة التمارين ومعدلات الاستشفاء والتمثيل الغذائي بدقة.', 'To calibrate workout intensity, recovery rates, and metabolism accurately.')}
              </p>
            </div>

            {/* Wheel Picker for Age */}
            <div className="relative flex flex-col items-center py-2">
              {/* Highlight band */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-14 rounded-2xl bg-gold/10 border border-gold/30 pointer-events-none z-10" />
              
              <div
                className="overflow-y-auto no-scrollbar h-[280px] w-full flex flex-col items-center"
                style={{ scrollSnapType: 'y mandatory' }}
              >
                {Array.from({ length: 66 }, (_, i) => i + 15).map((yr) => {
                  const isSelected = formData.age === yr;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setFormData({ ...formData, age: yr })}
                      style={{ scrollSnapAlign: 'center' }}
                      className={`h-14 w-full flex items-center justify-center transition-all shrink-0 ${
                        isSelected
                          ? 'text-white text-3xl font-black'
                          : Math.abs(formData.age - yr) === 1
                          ? 'text-taupe/70 text-xl font-bold'
                          : Math.abs(formData.age - yr) === 2
                          ? 'text-taupe/40 text-base font-semibold'
                          : 'text-taupe/20 text-sm'
                      }`}
                    >
                      {isSelected ? (
                        <span className="relative z-20">{yr} <span className="text-sm font-bold text-gold">{t('سنة', 'yrs')}</span></span>
                      ) : (
                        <span>{yr}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick tap buttons */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, age: Math.max(15, formData.age - 1) })}
                className="w-12 h-12 rounded-2xl bg-dark-900 border border-white/10 hover:border-gold/40 text-white font-bold text-xl transition-all"
              >−</button>
              <div className="px-6 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-white font-black text-lg">
                {formData.age} {t('سنة', 'yrs')}
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, age: Math.min(80, formData.age + 1) })}
                className="w-12 h-12 rounded-2xl bg-dark-900 border border-white/10 hover:border-gold/40 text-white font-bold text-xl transition-all"
              >+</button>
            </div>
          </div>
        )}

        {/* QUESTION 1: Height & Weight — Dual Smooth Wheel Picker */}
        {qIndex === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('كم طولكِ ووزنكِ الحالي؟', 'What is your current height and weight?')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('هذه المعلومة لحساب مؤشر كتلة الجسم (BMI) وتخصيص خطتكِ الفردية.', 'Used to calculate your BMI and personalize your individual plan.')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Height Wheel */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-xs font-bold text-taupe mb-3">
                  <Ruler size={14} className="text-gold" />
                  <span>{t('الطول', 'Height')}</span>
                </div>
                <div className="relative w-full">
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-12 rounded-xl bg-gold/10 border border-gold/30 pointer-events-none z-10" />
                  <div
                    className="overflow-y-auto no-scrollbar h-[240px] flex flex-col items-center"
                    style={{ scrollSnapType: 'y mandatory' }}
                  >
                    {Array.from({ length: 81 }, (_, i) => i + 130).map((h) => {
                      const isSel = formData.height === h;
                      const diff = Math.abs(formData.height - h);
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setFormData({ ...formData, height: h })}
                          style={{ scrollSnapAlign: 'center' }}
                          className={`h-12 w-full shrink-0 flex items-center justify-center transition-all ${
                            isSel ? 'text-white text-xl font-black' :
                            diff === 1 ? 'text-taupe/60 text-base font-bold' :
                            diff === 2 ? 'text-taupe/35 text-sm font-semibold' :
                            'text-taupe/15 text-xs'
                          }`}
                        >
                          <span className="relative z-20">{h} {isSel && <span className="text-xs text-gold font-bold">{t('سم','cm')}</span>}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setFormData({ ...formData, height: Math.max(130, formData.height - 1) })} className="w-10 h-10 rounded-xl bg-dark-900 border border-white/10 hover:border-gold/40 text-white font-bold text-lg">−</button>
                  <button onClick={() => setFormData({ ...formData, height: Math.min(210, formData.height + 1) })} className="w-10 h-10 rounded-xl bg-dark-900 border border-white/10 hover:border-gold/40 text-white font-bold text-lg">+</button>
                </div>
              </div>

              {/* Weight Wheel */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-xs font-bold text-taupe mb-3">
                  <Scale size={14} className="text-rose-400" />
                  <span>{t('الوزن', 'Weight')}</span>
                </div>
                <div className="relative w-full">
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 pointer-events-none z-10" />
                  <div
                    className="overflow-y-auto no-scrollbar h-[240px] flex flex-col items-center"
                    style={{ scrollSnapType: 'y mandatory' }}
                  >
                    {Array.from({ length: 151 }, (_, i) => i + 30).map((w) => {
                      const isSel = formData.weight === w;
                      const diff = Math.abs(formData.weight - w);
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setFormData({ ...formData, weight: w })}
                          style={{ scrollSnapAlign: 'center' }}
                          className={`h-12 w-full shrink-0 flex items-center justify-center transition-all ${
                            isSel ? 'text-white text-xl font-black' :
                            diff === 1 ? 'text-taupe/60 text-base font-bold' :
                            diff === 2 ? 'text-taupe/35 text-sm font-semibold' :
                            'text-taupe/15 text-xs'
                          }`}
                        >
                          <span className="relative z-20">{w} {isSel && <span className="text-xs text-rose-400 font-bold">{t('كجم','kg')}</span>}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setFormData({ ...formData, weight: Math.max(30, formData.weight - 1) })} className="w-10 h-10 rounded-xl bg-dark-900 border border-white/10 hover:border-gold/40 text-white font-bold text-lg">−</button>
                  <button onClick={() => setFormData({ ...formData, weight: Math.min(180, formData.weight + 1) })} className="w-10 h-10 rounded-xl bg-dark-900 border border-white/10 hover:border-gold/40 text-white font-bold text-lg">+</button>
                </div>
              </div>
            </div>

            {/* BMI Card */}
            <div className="p-4 rounded-2xl bg-dark-900/90 border border-gold/30 text-center space-y-1 shadow-luxury">
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

        {/* QUESTION 3: Training Location — 3 Options */}
        {qIndex === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('أين تفضلين ممارسة التمارين؟ 🏋️‍♀️', 'Where do you prefer to exercise? 🏋️‍♀️')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('المنظومة تدعم جميع الخيارات الثلاثة بنفس الكفاءة والشروحات.', 'The program supports all three options with equal efficiency and full instructions.')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'home', labelAr: '🏠 المنزل', labelEn: '🏠 At Home', descAr: 'أدوات بسيطة أو وزن الجسم فقط', descEn: 'Simple equipment or bodyweight only' },
                { id: 'gym', labelAr: '🏋️‍♀️ النادي (الجيم)', labelEn: '🏋️‍♀️ At the Gym', descAr: 'أجهزة وأوزان النادي كاملة', descEn: 'Full gym machines and weights' },
                { id: 'both', labelAr: '🔄 المنزل والنادي معاً', labelEn: '🔄 Home and Gym Together', descAr: 'مرونة التنقل بين البيت والجيم حسب أسبوعكِ', descEn: 'Flexible switching between home and gym each week' },
              ].map((loc) => {
                const isSelected = formData.trainingLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, trainingLocation: loc.id })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-white shadow-neon-gold'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-bold text-base text-white">{lang === 'ar' ? loc.labelAr : loc.labelEn}</div>
                      <div className="text-xs text-taupe/70 font-medium mt-0.5">{lang === 'ar' ? loc.descAr : loc.descEn}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ml-3 ${
                      isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'
                    }`}>
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 4 (NEW): Fitness Level */}
        {qIndex === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('ما هو مستواكِ الحالي؟ 💪', 'What is your current fitness level? 💪')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('لبناء التدرج الحركي المناسب لمستواكِ وتفادي الإرهاق أو الإصابات.', 'To structure the right movement progression and prevent fatigue or injuries.')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'beginner', labelAr: 'مبتدئة', labelEn: 'Beginner', descAr: 'جديدة على التمارين أو عودة بعد انقطاع طويل', descEn: 'New to workouts or returning after a long break' },
                { id: 'intermediate', labelAr: 'متوسطة', labelEn: 'Intermediate', descAr: 'لديّ معرفة بالتمارين وأمارس الرياضة بشكل متقطع', descEn: 'Familiar with exercises and workout intermittently' },
                { id: 'advanced', labelAr: 'متقدمة', labelEn: 'Advanced', descAr: 'ملتزمة بانتظام وأتحكم بالأوزان والتكنيك بكفاءة', descEn: 'Regularly committed with solid form and weights' },
              ].map((lvl) => {
                const isSelected = formData.fitnessLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, fitnessLevel: lvl.id })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-white shadow-neon-gold'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-bold text-base text-white">{lang === 'ar' ? lvl.labelAr : lvl.labelEn}</div>
                      <div className="text-xs text-taupe/70 font-medium mt-0.5">{lang === 'ar' ? lvl.descAr : lvl.descEn}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ml-3 ${
                      isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'
                    }`}>
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 5 (NEW): Workout Days Per Week */}
        {qIndex === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('كم مرة تستطيعين التمرين أسبوعياً؟ 📅', 'How many times can you workout per week? 📅')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('نصمم جدول التمارين بما يتوافق مع وقتكِ وروتينكِ الأسبوعي.', 'We tailor your training schedule to fit your available time and weekly routine.')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: '2', labelAr: '2 أيام', labelEn: '2 Days', descAr: 'جدول مرن للمشغولات جداً أو للمحافظة على النشاط', descEn: 'Flexible schedule for very busy routines' },
                { id: '3', labelAr: '3 أيام', labelEn: '3 Days', descAr: 'التوازن المثالي بين النتائج والاستمرارية', descEn: 'Ideal balance between results and consistency' },
                { id: '4', labelAr: '4 أيام', labelEn: '4 Days', descAr: 'تركيز أعمق على نحت الجسم وتفصيل القوام', descEn: 'Deeper focus on body sculpting and tone' },
                { id: '5', labelAr: '5 أيام', labelEn: '5 Days', descAr: 'كثافة رياضية عالية لنتائج سريعة متقدمة', descEn: 'High intensity for accelerated advanced results' },
              ].map((opt) => {
                const isSelected = formData.workoutDaysPerWeek === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, workoutDaysPerWeek: opt.id })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-white shadow-neon-gold'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-bold text-base text-white">{lang === 'ar' ? opt.labelAr : opt.labelEn}</div>
                      <div className="text-xs text-taupe/70 font-medium mt-0.5">{lang === 'ar' ? opt.descAr : opt.descEn}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ml-3 ${
                      isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'
                    }`}>
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
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
                {t('لحساب معدل الأيض اليومي (TDEE) بدقة.', 'To accurately calculate your Total Daily Energy Expenditure (TDEE).')}
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

        {/* QUESTION 8: Contact Info (Country + Phone + Instagram) */}
        {qIndex === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {t('وسائل التواصل ومكان الإقامة 📱', 'Contact Info & Residence 📱')}
              </h2>
              <p className="text-taupe text-xs md:text-sm font-medium">
                {t('أدخلي الدولة ورقم الواتساب والإنستجرام لتتواصل معكِ المدربة حنان خالد فوراً.', 'Enter your country, WhatsApp number and Instagram so Coach Hanan Khalid can contact you right away.')}
              </p>
            </div>

            {/* Country field — moved here from step 0 */}
            <div>
              <label className="block text-xs font-bold text-cream mb-2">
                {t('الدولة التي تقيمين فيها', 'Country of residence')} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder={t('مثال: السعودية، الإمارات، الكويت، مصر...', 'e.g., Saudi Arabia, UAE, Kuwait, Egypt...')}
                className="form-input w-full"
                dir="auto"
              />
            </div>

            <div className="space-y-4">
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
                              key={c.name + c.dialCode}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setShowCountryMenu(false);
                                setCountrySearch('');
                              }}
                              className={`w-full text-right px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${
                                selectedCountry.name === c.name ? 'bg-gold/20 text-gold' : 'hover:bg-white/10 text-white'
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="501234567"
                    className="form-input flex-1 text-base font-bold dir-ltr"
                  />
                </div>

                <span className="text-[11px] text-taupe/70 mt-1.5 block">
                  {t('سيتم التواصل الفوري عبر الواتساب على الرقم المفعل كـ: ', 'You will be contacted on WhatsApp as: ')}
                  <span className="text-gold font-bold dir-ltr inline-block">{selectedCountry.dialCode} {formData.phone || '50xxxxxxx'}</span>
                </span>
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
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="username"
                    className="form-input w-full pr-9"
                    dir="ltr"
                  />
                </div>
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
