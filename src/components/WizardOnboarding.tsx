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

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maewaaoj';

export interface CountryCode {
  name: string;
  dialCode: string;
  flag: string;
}

const countryList: CountryCode[] = [
  { name: 'السعودية', dialCode: '+966', flag: '🇸🇦' },
  { name: 'الإمارات', dialCode: '+971', flag: '🇦🇪' },
  { name: 'الكويت', dialCode: '+965', flag: '🇰🇼' },
  { name: 'قطر', dialCode: '+974', flag: '🇶🇦' },
  { name: 'البحرين', dialCode: '+973', flag: '🇧🇭' },
  { name: 'عمان', dialCode: '+968', flag: '🇴🇲' },
  { name: 'مصر', dialCode: '+20', flag: '🇪🇬' },
  { name: 'الأردن', dialCode: '+962', flag: '🇯🇴' },
  { name: 'العراق', dialCode: '+964', flag: '🇮🇶' },
  { name: 'المغرب', dialCode: '+212', flag: '🇲🇦' },
  { name: 'الجزائر', dialCode: '+213', flag: '🇩🇿' },
  { name: 'تونس', dialCode: '+216', flag: '🇹🇳' },
  { name: 'لبنان', dialCode: '+961', flag: '🇱🇧' },
  { name: 'سوريا', dialCode: '+963', flag: '🇸🇾' },
  { name: 'فلسطين', dialCode: '+970', flag: '🇵🇸' },
  { name: 'اليمن', dialCode: '+967', flag: '🇾🇪' },
  { name: 'السودان', dialCode: '+249', flag: '🇸🇩' },
  { name: 'ليبيا', dialCode: '+218', flag: '🇱🇾' },
  { name: 'تركيا', dialCode: '+90', flag: '🇹🇷' },
  { name: 'موريتانيا', dialCode: '+222', flag: '🇲🇷' },
  { name: 'الصومال', dialCode: '+252', flag: '🇸🇴' },
  { name: 'المملكة المتحدة', dialCode: '+44', flag: '🇬🇧' },
  { name: 'الولايات المتحدة', dialCode: '+1', flag: '🇺🇸' },
  { name: 'كندا', dialCode: '+1', flag: '🇨🇦' },
  { name: 'ألمانيا', dialCode: '+49', flag: '🇩🇪' },
  { name: 'فرنسا', dialCode: '+33', flag: '🇫🇷' },
  { name: 'إسبانيا', dialCode: '+34', flag: '🇪🇸' },
  { name: 'إيطاليا', dialCode: '+39', flag: '🇮🇹' },
  { name: 'السويد', dialCode: '+46', flag: '🇸🇪' },
  { name: 'النرويج', dialCode: '+47', flag: '🇳🇴' },
  { name: 'ماليزيا', dialCode: '+60', flag: '🇲🇾' },
];

interface WizardProps {
  onComplete?: () => void;
}

export default function WizardOnboarding({ onComplete }: WizardProps) {
  // Main Step State: 'welcome' | 'questions' | 'calculating' | 'recommendation' | 'success'
  const [step, setStep] = useState<'welcome' | 'questions' | 'calculating' | 'recommendation' | 'success'>('welcome');
  const [qIndex, setQIndex] = useState(0);

  // Form Data State
  const [formData, setFormData] = useState({
    age: '24',
    country: '',
    height: 165,
    weight: 62,
    pathId: 'feminine-shape',
    trainingLocation: 'home',
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
    (c) => c.name.includes(countrySearch) || c.dialCode.includes(countrySearch)
  );

  // Handle BMI Calculation & Physical Need Breakdown
  const heightM = formData.height / 100;
  const bmiValue = parseFloat((formData.weight / (heightM * heightM)).toFixed(1));

  let bmiCategory = 'وزن طبيعي ومثالي';
  let bmiColor = 'text-emerald-400';
  let physicalNeed: 'weight-gain' | 'moderate-gain' | 'ideal' | 'fat-loss' | 'high-fat-loss' = 'ideal';

  if (bmiValue < 18.5) {
    bmiCategory = 'نقص في الوزن (يحتاج زيادة امتلاء أنثوي)';
    bmiColor = 'text-amber-400';
    physicalNeed = 'weight-gain';
  } else if (bmiValue >= 18.5 && bmiValue <= 21.0) {
    bmiCategory = 'متوسط (يحتاج زيادة وزن قليلة وامتلاء أنثوي)';
    bmiColor = 'text-amber-300';
    physicalNeed = 'moderate-gain';
  } else if (bmiValue > 21.0 && bmiValue < 25.0) {
    bmiCategory = 'وزن طبيعي ومثالي';
    bmiColor = 'text-emerald-400';
    physicalNeed = 'ideal';
  } else if (bmiValue >= 25.0 && bmiValue < 30.0) {
    bmiCategory = 'زيادة بسيطة في الوزن (يحتاج نحت وتنحيف)';
    bmiColor = 'text-amber-300';
    physicalNeed = 'fat-loss';
  } else if (bmiValue >= 30.0) {
    bmiCategory = 'زيادة ملحوظة / سمنة (يحتاج خفض دهون ونحت)';
    bmiColor = 'text-rose-400';
    physicalNeed = 'high-fat-loss';
  }

  // Evaluate Alignment between Selected Path and Physical Need
  const isLowWeight = physicalNeed === 'weight-gain' || physicalNeed === 'moderate-gain';
  const isHighWeight = physicalNeed === 'fat-loss' || physicalNeed === 'high-fat-loss';
  const selectedPathObj = paths.find((p) => p.id === formData.pathId) || paths[0];

  let isMisaligned = false;
  let advisoryTitle = '';
  let advisoryMessage = '';

  if (isLowWeight && formData.pathId === 'fat-loss') {
    isMisaligned = true;
    advisoryTitle = '⚠️ ملاحظة توجيهية هامة من التحليل البدني';
    advisoryMessage = `بناءً على طولكِ ووزنكِ الحالي (BMI: ${bmiValue} - ${bmiCategory})، اختياركِ لمسار «التنحيف والنحت» قد لا يتناسب تماماً مع كتلة جسمكِ الحالية التي تحتاج زيادة وزن وامتلاء وليس خفض دهون. ستراجع المدربة حنان خالد حالتكِ شخصياً لتوجيه خطتكِ بما يحقق التناسق والامتلاء المطلوبين بأمان.`;
  } else if (isHighWeight && formData.pathId === 'weight-gain') {
    isMisaligned = true;
    advisoryTitle = '⚠️ ملاحظة توجيهية هامة من التحليل البدني';
    advisoryMessage = `بناءً على طولكِ ووزنكِ الحالي (BMI: ${bmiValue} - ${bmiCategory})، اختياركِ لمسار «زيادة الوزن» قد لا يتناسب تماماً مع كتلة جسمكِ الحالية التي تحتاج خفض نسبة الدهون ونحت الجسم بدلاً من زيادة السعرات. ستراجع المدربة حنان خالد حالتكِ لتعديل خطتكِ نحو النحت وخسارة الدهون.`;
  } else {
    isMisaligned = false;
    advisoryTitle = '✅ توافق ممتاز مع التحليل البدني';
    advisoryMessage = `اختياركِ لمسار «${selectedPathObj.title}» متوافق تماماً مع مؤشر كتلة جسمكِ الحالي (${bmiCategory})، وسيقوم النظام بتفصيل احتياجكِ بناءً عليه.`;
  }

  // Scroll to top on any step change or question change, especially on success
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

  // Total Questionnaire Steps Count = 7
  const TOTAL_STEPS = 7;
  const currentStepNum = qIndex + 1;
  const progressPercent = Math.round((currentStepNum / TOTAL_STEPS) * 100);

  const handleNextQuestion = () => {
    setErrorMsg('');
    // Validations
    if (qIndex === 0 && (!formData.age || !formData.country.trim())) {
      setErrorMsg('يرجى تحديد العمر والدولة قبل المتابعة');
      return;
    }
    if (qIndex === 5 && (!formData.healthIssues.trim() || !formData.medications.trim())) {
      setErrorMsg('يرجى توضيح الحالة الصحية والأدوية (أو كتابة «لا يوجد»)');
      return;
    }
    if (qIndex === 6) {
      if (!formData.phone.trim() || formData.phone.length < 8) {
        setErrorMsg('يرجى إدخال رقم الواتساب بشكل صحيح لكي نستطيع التواصل معكِ');
        return;
      }
      if (!formData.instagram.trim()) {
        setErrorMsg('يرجى إدخال حساب الإنستجرام الخاص بكِ');
        return;
      }
      // Trigger calculation state
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
          العمر: formData.age,
          الدولة: formData.country,
          الطول_سم: formData.height,
          الوزن_كغ: formData.weight,
          مؤشر_BMI: `${bmiValue} (${bmiCategory})`,
          توافق_المسار_مع_البدن: isMisaligned ? '⚠️ تحذير: المسار المختار لا يتناسب مع كتلة الجسم وتلزم المراجعة' : '✅ متوافق تماماً مع كتلة الجسم',
          المسار_المختار: chosenPath,
          مكان_التدريب: formData.trainingLocation === 'home' ? '🏠 المنزل (Home)' : '🏋️‍♀️ الجيم (Gym)',
          المشاكل_الصحية: formData.healthIssues,
          الأدوية: formData.medications,
          نمط_الحياة: formData.lifestyle,
        }),
      });

      if (res.ok) {
        setFormData({ ...formData, selectedPlanId: planId });
        setStep('success');
        window.scrollTo(0, 0);
        if (onComplete) onComplete();
      } else {
        setErrorMsg('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
      }
    } catch {
      setErrorMsg('تعذر الاتصال بالسيرفر. يرجى التحقق من اتصال الإنترنت.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER STEP 1: WELCOME SCREEN
  // -------------------------------------------------------------
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden" dir="rtl">
        {/* Glowing Ambient Radial Glow */}
        <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
        <div className="absolute inset-0 digital-grid-bg opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-xl w-full text-center space-y-6">
          
          {/* Header Logo */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-full p-1 border-2 border-gold/40 shadow-neon-gold bg-dark-900/80">
              <img src={logoImg} alt="Coach Hanan" className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">د/ك : حنان خالد</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            خلينا نختار لكِ البرنامج والمسار الأنسب 🌸
          </h1>

          <p className="text-taupe text-sm md:text-base leading-relaxed max-w-md mx-auto font-medium">
            أجيبي عن أسئلة بسيطة، وسأستطيع من خلالها بناء خطة تغذية وبرنامج تدريبي مخصص لحالتكِ بدقة عالية ومفيدة جداً.
          </p>

          {/* Hero Feature Badge */}
          <div className="p-4 rounded-2xl bg-dark-900/90 border border-gold/30 shadow-luxury flex items-center justify-center gap-3 text-cream">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold font-bold">
              ⚡
            </div>
            <span className="text-sm font-bold">خطة تمرين شاملة + تغذية مرنة مناسبة لهدفكِ</span>
          </div>

          {/* Action CTA Button */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => setStep('questions')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold via-amber-500 to-gold text-dark-950 font-extrabold text-base md:text-lg shadow-neon-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              ابدئي الآن
              <ArrowLeft size={20} />
            </button>
            <p className="text-xs text-taupe/70 font-medium">✨ النتيجة والتوصية تظهر لكِ مباشرة قبل تأكيد الدفع</p>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP 2: CALCULATING ANIMATION SCREEN
  // -------------------------------------------------------------
  if (step === 'calculating') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12 relative" dir="rtl">
        <div className="absolute inset-0 bg-dark-radial" />
        <div className="relative z-10 max-w-md w-full text-center space-y-8">
          
          <div className="text-6xl md:text-7xl font-black gradient-text animate-pulse">
            {calcProgress}%
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">جاري تحليل بياناتكِ وتجهيز خطتكِ...</h2>
            <p className="text-xs text-taupe">نعمل على صياغة التوصية التغذوية والتدريبية المناسبة</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-gold to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${calcProgress}%` }}
            />
          </div>

          {/* Dynamic Checklist */}
          <div className="space-y-3 text-right bg-dark-900/60 p-5 rounded-2xl border border-white/10">
            {[
              { label: 'تحليل إجاباتكِ والبيانات البدنية', active: checkState[0] },
              { label: 'حساب مؤشر كتلة الجسم (BMI)', active: checkState[1] },
              { label: 'تحديد مسار التغذية والتمارين المناسب', active: checkState[2] },
              { label: 'تجهيز توصية الخطة والباقة النهائية', active: checkState[3] },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${item.active ? 'bg-gold text-dark-950' : 'border border-taupe/40 text-transparent'}`}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className={item.active ? 'text-white font-bold' : 'text-taupe/60'}>{item.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP 3: RECOMMENDATION & PACKAGE SELECTION
  // -------------------------------------------------------------
  if (step === 'recommendation') {
    const selectedPathObj = paths.find((p) => p.id === formData.pathId) || paths[0];

    return (
      <div className="min-h-screen bg-dark-950 py-12 px-4 relative" dir="rtl">
        <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30">
              <Sparkles size={14} />
              نتيجة التحليل وتوصية البرنامج
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              مسار <span className="gradient-text">«{selectedPathObj.title}»</span> 🎯
            </h1>
            <p className="text-taupe text-sm leading-relaxed max-w-xl mx-auto">
              بناءً على نتائج قياساتكِ البدنية (BMI: {bmiValue} — {bmiCategory}) وهدفكِ المح محدد، صممنا لكِ باقات المتابعة التالية:
            </p>
          </div>

          {/* Physical Need & Path Alignment Advisory Banner Card */}
          <div className={`p-5 rounded-2xl border text-right max-w-xl mx-auto space-y-2 shadow-luxury ${
            isMisaligned 
              ? 'bg-amber-950/90 border-amber-500/60 text-amber-200' 
              : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
          }`}>
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
                  <h3 className="text-xl font-extrabold text-white mb-2">{tier.name}</h3>
                  <p className="text-xs text-taupe mb-6 leading-relaxed">{tier.description}</p>
                  
                  {/* Price Box */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black text-white">{tier.priceSAR}</span>
                      <span className="text-xs text-taupe font-bold mr-1">ريال سعودي</span>
                    </div>
                    <span className="text-lg font-bold text-gold">{tier.priceUSD}$</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 mb-8">
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-cream">
                        <CheckCircle2 size={16} className="text-gold shrink-0" />
                        <span>{feat}</span>
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
                      اختاري {tier.name} واعتمدي بياناتكِ
                    </>
                  )}
                </button>
              </div>
            ))}
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
      <div className="min-h-screen bg-dark-950 py-12 px-4 relative" dir="rtl">
        <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-center">
          
          {/* Confirmation Box */}
          <div className="p-8 md:p-10 rounded-3xl bg-dark-900/90 border border-gold/40 shadow-luxury space-y-5 max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 size={44} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              تم إرسال بياناتكِ وأصبحت حالياً تحت المراجعة! 🎉
            </h1>
            <p className="text-taupe text-sm md:text-base leading-relaxed font-medium">
              وصلتنا كافة بياناتكِ بنجاح. سيتم التواصل معكِ شخصياً خلال 24 ساعة عبر الواتساب (<span className="text-gold dir-ltr inline-block">{formData.phone}</span>) او الأنستجرام بواسطة المدربة <strong className="text-cream">حنان خالد</strong> لتزويدكِ ببقية التفاصيل ثم تزويدك بالنظام والبدء .
            </p>

            {/* Physical Alignment Note inside Success Box */}
            <div className={`p-4 rounded-2xl border text-right space-y-1 text-xs md:text-sm font-medium ${
              isMisaligned
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="font-bold mb-1">{advisoryTitle}</div>
              <p className="leading-relaxed opacity-90">{advisoryMessage}</p>
            </div>
          </div>

          {/* Full Informational Section extracted from user screenshots */}
          <SubscriptionTermsInfo />

          {/* CTA Button to Navigate to Homepage */}
          <div className="pt-8 pb-12 text-center">
            <Link
              to="/home"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-gold via-amber-500 to-gold text-dark-950 font-extrabold text-base md:text-lg shadow-neon-gold hover:scale-105 transition-all"
            >
              الانتقال للصفحة الرئيسية واستكشاف باقي التفاصيل
              <ArrowLeft size={20} />
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
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between py-6 px-4 relative" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-dark-radial pointer-events-none" />
      <div className="absolute inset-0 digital-grid-bg opacity-15 pointer-events-none" />

      {/* Top Header & Progress Bar */}
      <div className="relative z-10 max-w-2xl mx-auto w-full pt-2">
        <div className="flex items-center justify-between text-xs text-taupe mb-2 font-bold">
          <button onClick={handlePrevQuestion} className="flex items-center gap-1 hover:text-white transition-colors">
            <ArrowRight size={16} />
            السابق
          </button>
          <span>الخطوة {currentStepNum} من {TOTAL_STEPS}</span>
          <span className="text-gold font-extrabold">{progressPercent}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-gold to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Container */}
      <div className="relative z-10 max-w-2xl mx-auto w-full my-auto py-8">
        
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs md:text-sm flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* QUESTION 0: Age & Country */}
        {qIndex === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">كم عمركِ وفي أي دولة تقيمين؟</h2>
              <p className="text-taupe text-xs md:text-sm font-medium">تساعدنا هذه البيانات في تحديد احتياجكِ وملاءمة الأطعمة المحلية لكِ.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cream mb-2">العمر (بالسنوات)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="24"
                  className="form-input w-full text-center text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cream mb-2">الدولة التي تقيمين فيها</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="مثال: السعودية، الإمارات، الكويت..."
                  className="form-input w-full text-right"
                />
              </div>
            </div>
          </div>
        )}

        {/* QUESTION 1: Height & Weight (BMI Calculation Step - Matching Image 2) */}
        {qIndex === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">كم طولكِ وووزنكِ الحالي؟</h2>
              <p className="text-taupe text-xs md:text-sm font-medium">هذه المعلومة لحساب مؤشر كتلة الجسم (BMI) وتخصيص خطتكِ الفردية.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Height Selector Card */}
              <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-taupe">
                  <Ruler size={16} className="text-gold" />
                  <span>الطول (سم)</span>
                </div>
                <div className="text-3xl font-black text-white">{formData.height} <span className="text-sm font-normal text-taupe">سم</span></div>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => setFormData({ ...formData, height: Math.max(130, formData.height - 1) })}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10"
                  >-</button>
                  <button 
                    onClick={() => setFormData({ ...formData, height: Math.min(210, formData.height + 1) })}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10"
                  >+</button>
                </div>
              </div>

              {/* Weight Selector Card */}
              <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-taupe">
                  <Scale size={16} className="text-rose-400" />
                  <span>الوزن الحالي (كجم)</span>
                </div>
                <div className="text-3xl font-black text-white">{formData.weight} <span className="text-sm font-normal text-taupe">كجم</span></div>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => setFormData({ ...formData, weight: Math.max(30, formData.weight - 1) })}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10"
                  >-</button>
                  <button 
                    onClick={() => setFormData({ ...formData, weight: Math.min(180, formData.weight + 1) })}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Calculated BMI Card (Same design as reference screenshot 2) */}
            <div className="p-5 rounded-2xl bg-dark-900/90 border border-gold/30 text-center space-y-1 shadow-luxury">
              <div className="text-xs font-bold text-taupe">مؤشر كتلة الجسم (BMI)</div>
              <div className="text-4xl font-black text-white">{bmiValue}</div>
              <div className={`text-sm font-bold ${bmiColor}`}>{bmiCategory}</div>
            </div>
          </div>
        )}

        {/* QUESTION 2: Goal & Path Selection (Matching Image 3) */}
        {qIndex === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">ما هو هدفكِ الرئيسي؟ 🎯</h2>
              <p className="text-taupe text-xs md:text-sm font-medium">اختاري المسار الأقرب لهدفكِ الحالي لضبط التغذية والتمارين بناءً عليه.</p>
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
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold/15 border-gold shadow-neon-gold text-white'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-white">{p.title}</span>
                        {isRecommendedForBody && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                            ✨ موصى به لكتلة جسمكِ
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-taupe/80">{p.subtitle}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'}`}>
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">أين تفضلين ممارسة التمارين الرياضية؟ 🏋️‍♀️</h2>
              <p className="text-taupe text-xs md:text-sm font-medium">المنظومة تدعم الخيارين (البيت أو النادي) بنفس الكفاءة والشروحات.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'home', title: '🏠 في المنزل', desc: 'أدوات بسيطة أو وزن الجسم' },
                { id: 'gym', title: '🏋️‍♀️ في الجيم', desc: 'أجهزة وأوزان النادي' },
              ].map((loc) => {
                const isSelected = formData.trainingLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, trainingLocation: loc.id })}
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between h-36 ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-white shadow-neon-gold'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <div className="text-lg font-bold text-white">{loc.title}</div>
                    <div className="text-xs text-taupe/80 font-medium">{loc.desc}</div>
                    <div className="self-end">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'}`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 4: Lifestyle & Activity */}
        {qIndex === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">صفّي طبيعة نشاطكِ ويومكِ اليومي</h2>
              <p className="text-taupe text-xs md:text-sm font-medium">لحساب معدل الأيض اليومي (TDEE) بدقة.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'office', label: '💼 عمل مكتبي — جلوس معظم اليوم' },
                { id: 'active', label: '🚶‍♀️ حركة كثيرة — وقوف وتنقل مستمر' },
                { id: 'student', label: '📚 دراسة ومشي كثير' },
                { id: 'housewife', label: '🏠 ربة منزل نشطة' },
              ].map((opt) => {
                const isSelected = formData.lifestyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, lifestyle: opt.id })}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-white shadow-neon-gold'
                        : 'bg-dark-900/80 border-white/10 text-taupe hover:border-white/30'
                    }`}
                  >
                    <span className="font-bold text-sm text-white">{opt.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-gold border-gold text-dark-950' : 'border-taupe/40'}`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 5: Health Conditions & Medications */}
        {qIndex === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">الحالة الصحية والأدوية 🩺</h2>
              <p className="text-taupe text-xs md:text-sm font-medium">لنضمن ملاءمة النظام لسلامتكِ (مثل خمول الغدة، تكيسات المبايض، القولون...).</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cream mb-2">هل لديكِ أي مشاكل صحية؟</label>
                <textarea
                  rows={2}
                  value={formData.healthIssues}
                  onChange={(e) => setFormData({ ...formData, healthIssues: e.target.value })}
                  placeholder="مثال: تكيسات مبايض، خمول غدة، قولون عصبي... (إذا لا يوجد اكتبي: لا يوجد)"
                  className="form-input w-full text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cream mb-2">هل تستهلكين أي أدوية حالياً؟</label>
                <input
                  type="text"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder="اذكري اسم الدواء أو اكتبي «لا يوجد»"
                  className="form-input w-full text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* QUESTION 6: Contact Info (Phone Number + Instagram Username) */}
        {qIndex === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">وسائل التواصل المباشرة 📱</h2>
              <p className="text-taupe text-xs md:text-sm font-medium">أدخلي رقم الواتساب والإنستجرام لتتواصل معكِ المدربة حنان خالد فوراً.</p>
            </div>

            <div className="space-y-4">
              {/* Phone / WhatsApp (WITH MODERN COUNTRY PICKER & SEARCH) */}
              <div>
                <label className="block text-xs font-bold text-cream mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-emerald-400" />
                    رقم الواتساب / الجوال <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-xs text-taupe font-medium">{selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})</span>
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
                            placeholder="ابحثي عن الدولة..."
                            className="bg-transparent text-xs text-white p-1 w-full outline-none text-right font-medium"
                            dir="rtl"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto space-y-1 max-h-48 text-right pr-1">
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
                                <span>{c.name}</span>
                              </span>
                              <span className="text-gold font-bold dir-ltr">{c.dialCode}</span>
                            </button>
                          ))}
                          {filteredCountries.length === 0 && (
                            <p className="text-xs text-taupe text-center py-4">لم نجد دولة بهذا الاسم</p>
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
                    className="form-input flex-1 text-right text-base font-bold dir-ltr"
                  />
                </div>

                <span className="text-[11px] text-taupe/70 mt-1.5 block">
                  سيتم التواصل الفوري عبر الواتساب على الرقم المفعل كـ: <span className="text-gold font-bold dir-ltr inline-block">{selectedCountry.dialCode} {formData.phone || '50xxxxxxx'}</span>
                </span>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-cream mb-2 flex items-center gap-1.5">
                  <AtSign size={14} className="text-rose-400" />
                  يوزر الإنستجرام الخاص بكِ <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe font-bold text-sm">@</span>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="username"
                    className="form-input w-full pr-9 text-right"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 max-w-2xl mx-auto w-full pt-4 pb-2">
        <button
          onClick={handleNextQuestion}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold via-amber-500 to-gold text-dark-950 font-extrabold text-base md:text-lg shadow-neon-gold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {qIndex === 6 ? 'إظهار التوصية والنتيجة ✨' : 'متابعة'}
          <ArrowLeft size={20} />
        </button>
      </div>

    </div>
  );
}
