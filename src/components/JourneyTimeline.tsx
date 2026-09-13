import { useLang } from '../context/LanguageContext';

const journeyStepsData = [
  {
    number: '01',
    titleAr: 'حدد هدفكِ',
    titleEn: 'Define Your Goal',
    descriptionAr: 'حددي ما تسعين لإبرازه — نحت قوام، زيادة وزن صحية، خسارة دهون، أو نمط حركي قوي.',
    descriptionEn: 'Determine what you want to achieve — sculpting your physique, healthy weight gain, fat loss, or building a strong active lifestyle.',
    icon: '🎯',
    tag: 'Step One',
  },
  {
    number: '02',
    titleAr: 'تقييم مستواكِ الأولي',
    titleEn: 'Initial Level Assessment',
    descriptionAr: 'سواء كنتِ مبتدئة أو لديكِ خبرة — يبدأ البرنامج من نقطتكِ الحالية مباشرة.',
    descriptionEn: 'Whether you\'re a beginner or experienced — the program starts directly from where you are right now.',
    icon: '📊',
    tag: 'Assessment',
  },
  {
    number: '03',
    titleAr: 'بيئة التدريب المفضلة',
    titleEn: 'Your Preferred Training Environment',
    descriptionAr: 'منزلكِ بحد أدنى من الأدوات أو الجيم بكامل المعدات — المنظومة تدعم الخيارين بنفس الكفاءة.',
    descriptionEn: 'Your home with minimal equipment or the gym with full gear — the system supports both options with equal efficiency.',
    icon: '🏠',
    tag: 'Home / Gym',
  },
  {
    number: '04',
    titleAr: 'انطلاقة مساركِ',
    titleEn: 'Your Path Begins',
    descriptionAr: 'تغذية محسوبة الدقة + جدول تمارين مبني خصيصاً لهدفكِ لتبدئي برؤية التغير سريعاً.',
    descriptionEn: 'Precisely calculated nutrition + a training schedule built specifically for your goal so you start seeing change quickly.',
    icon: '🚀',
    tag: 'Nutrition + Training',
  },
  {
    number: '05',
    titleAr: 'متابعة وتوثيق التحول',
    titleEn: 'Tracking & Documenting Progress',
    descriptionAr: 'تتبع دوري شامل للمقاسات، القوة الحركية، ومؤشرات تناسق القوام.',
    descriptionEn: 'Comprehensive periodic tracking of measurements, movement strength, and body symmetry indicators.',
    icon: '📈',
    tag: 'Progress Tracking',
  },
  {
    number: '06',
    titleAr: 'تطوير وتحديث مستمر',
    titleEn: 'Continuous Development & Updates',
    descriptionAr: 'تعديلات متصاعدة في الخطة لضمان استمرار التحول السريع وعدم ثبات النتيجة.',
    descriptionEn: 'Progressive adjustments to the plan to ensure continued rapid transformation and prevent plateau.',
    icon: '✨',
    tag: 'Continuous Growth',
  },
];

export default function JourneyTimeline() {
  const { lang, t, dir } = useLang();

  return (
    <section id="journey" className="py-24 md:py-32 bg-dark-950 relative overflow-hidden" dir={dir}>
      <div className="absolute right-1/2 top-28 bottom-28 w-px hidden lg:block" style={{ background: 'linear-gradient(to bottom, transparent, rgba(186,120,92,0.6) 20%, rgba(186,120,92,0.6) 80%, transparent)' }} />
      <div className="absolute inset-0 digital-grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            {t('كيف تعمل الرحلة؟', 'How Does the Journey Work?')}
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            {t(
              <>{`ست خطوات دقيقة`}{' '}<span className="gradient-text">{'تقودكِ نحو التحول المشدود.'}</span></>,
              <>{`Six precise steps`}{' '}<span className="gradient-text">{'leading you to your toned transformation.'}</span></>
            )}
          </h2>
          <div className="divider-gold" />
        </div>

        {/* Timeline */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 relative">
          {journeyStepsData.map((step, index) => (
            <div key={step.number} className={`animate-on-scroll delay-${Math.min(index + 1, 6)} relative`}>
              <div
                className="rounded-3xl p-6 md:p-8 transition-all duration-400 hover:-translate-y-1 group"
                style={{
                  background: 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.85) 100%)',
                  border: '1px solid rgba(239,208,213,0.18)',
                  boxShadow: '0 4px 25px rgba(0,0,0,0.4)',
                }}
              >
                {/* Number + Icon row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <span
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-neon-rose"
                      style={{ background: 'linear-gradient(135deg, rgba(90,33,53,0.9), rgba(63,20,37,0.7))', border: '1px solid rgba(239,208,213,0.3)' }}
                    >
                      {step.icon}
                    </span>
                    <span className="text-5xl font-extrabold text-gold/30" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {step.number}
                    </span>
                  </div>
                  {step.tag && (
                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide text-cream bg-dark-800/80 border border-beige/20">
                      {step.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cream transition-colors">
                  {lang === 'ar' ? step.titleAr : step.titleEn}
                </h3>
                <p className="text-sm md:text-base text-taupe leading-relaxed font-medium">
                  {lang === 'ar' ? step.descriptionAr : step.descriptionEn}
                </p>

                {/* Hover accent */}
                <div className="absolute bottom-0 right-0 left-0 h-0.5 rounded-b-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, #BA785C, #EFD0D5, transparent)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
