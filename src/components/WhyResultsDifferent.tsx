import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function WhyResultsDifferent() {
  const { lang, t, dir } = useLang();

  return (
    <section id="why-different" className="py-24 md:py-32 bg-dark-950 relative overflow-hidden" dir={dir}>
      {/* Background Gradients & Grids */}
      <div className="absolute inset-0 bg-dark-radial opacity-80 pointer-events-none" />
      <div className="absolute inset-0 digital-dots-bg opacity-20 pointer-events-none" />

      {/* Ambient Glowing Orbs */}
      <div
        className="absolute top-1/4 right-10 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(186,120,92,0.8) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            <Sparkles size={14} className="text-gold animate-spin inline mx-2" style={{ animationDuration: '4s' }} />
            {t('فلسفة المنظومة', 'System Philosophy')}
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            {lang === 'ar' ? (
              <>
                لماذا النتائج <span className="gradient-text">مختلفة معي؟</span>
              </>
            ) : (
              <>
                Why Are Results <span className="gradient-text">Different With Me?</span>
              </>
            )}
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            {t(
              'السر لا يكمن في إعطاء جداول عشوائية، بل في فهم البيولوجيا الفردية لجسمكِ واستجابته الخاصة.',
              "The secret doesn't lie in generic templates, but in understanding your body's unique biology and response."
            )}
          </p>
        </div>

        {/* Core Philosophy Banner */}
        <div className="animate-on-scroll delay-2 max-w-4xl mx-auto mb-14">
          <div
            className="rounded-3xl p-6 md:p-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(90,33,53,0.8) 0%, rgba(63,20,37,0.95) 100%)',
              border: '1.5px solid rgba(186,120,92,0.4)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #EFD0D5 0%, transparent 70%)',
              }}
            />
            <p className="relative z-10 text-lg md:text-xl font-extrabold text-white leading-relaxed">
              {t(
                '"أحب أوضح لكِ من البداية أنني لا أعمل على نظام جاهز أو عشوائي، لأن كل جسم يختلف عن الآخر في الاستجابة والاحتياج."',
                '"I want to clarify from the start that I never provide generic or ready-made plans; every female body has a unique response, metabolism, and individual needs."'
              )}
            </p>
          </div>
        </div>

        {/* 3 Misconceptions vs Truth Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {/* Card 1: Weight Gain */}
          <div className="animate-on-scroll delay-1 flex flex-col justify-between rounded-4xl p-7 md:p-8 card-dark-glass border border-beige/20 hover:border-gold/50 transition-all duration-400">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center text-xl">
                  📈
                </span>
                <div>
                  <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                    {t('زيادة الوزن والامتلاء', 'Weight Gain & Fullness')}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">
                    {t('حقيقة الهضم والامتصاص', 'Digestion & Absorption Reality')}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-rose-200/90 font-medium text-xs">
                  <span className="font-bold text-rose-300 block mb-1">
                    {t('❌ الاعتقاد الشائع:', '❌ Common Myth:')}
                  </span>
                  {t(
                    '«حقيقي الحرق عالي أو جيناتي وراثية ما تخليني أزيد لو شو ما أكلت!»',
                    '"My metabolism is too high or my genetics prevent me from gaining weight no matter how much I eat!"'
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-gold/30 text-cream/95 font-medium text-xs md:text-sm">
                  <span className="font-bold text-gold block mb-1">
                    {t('✔️ الحقيقة مع الكوتش حنان:', '✔️ The Reality with Coach Hanan:')}
                  </span>
                  {lang === 'ar' ? (
                    <>
                      لما عرفنا التفاصيل اكتشفنا إن المشكلة مو بالحرق أصلاً ولا بالجينات! لأن لازم الأول جسمكِ يعرف: <strong className="text-white">يهضم، يمتص، ويستفيد من اللي أكلتيه</strong> عشان يقدر يبني عليه ويزيد.
                      <br /><br />
                      عشان كذا الحل مو بس «كلي أكثر»… المهم نعرف السبب ونعالج أصل المشكلة لجسمكِ بنظام غذائي وتوزيع وجبات وروتين مختلف، وهذا هو سبب ظهور النتائج وتحسن الشهية من أول أسبوع.
                    </>
                  ) : (
                    <>
                      When we analyze your body details, we find that the issue isn't metabolism or genetics! Your body must first learn how to: <strong className="text-white">digest, absorb, and utilize nutrients</strong> to build feminine fullness.
                      <br /><br />
                      That's why the answer is never simply "eat more" — we address the root cause with optimal nutrient timing, digestive ease, and targeted routines, triggering visible appetite and fullness gains from week one.
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Fat Loss */}
          <div className="animate-on-scroll delay-2 flex flex-col justify-between rounded-4xl p-7 md:p-8 card-dark-glass border border-beige/20 hover:border-gold/50 transition-all duration-400">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center text-xl">
                  🔥
                </span>
                <div>
                  <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                    {t('خسارة الدهون والنحت', 'Fat Loss & Sculpting')}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">
                    {t('التنحيف الذكي بدون حرمان', 'Smart Fat Loss Without Deprivation')}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-rose-200/90 font-medium text-xs">
                  <span className="font-bold text-rose-300 block mb-1">
                    {t('❌ الاعتقاد الشائع:', '❌ Common Myth:')}
                  </span>
                  {t(
                    '«التنحيف يعني الحرمان وجوع الساعات الطويلة وقطع النشويات تماماً!»',
                    '"Fat loss requires starving for hours and eliminating carbs entirely!"'
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-gold/30 text-cream/95 font-medium text-xs md:text-sm">
                  <span className="font-bold text-gold block mb-1">
                    {t('✔️ الحقيقة مع الكوتش حنان:', '✔️ The Reality with Coach Hanan:')}
                  </span>
                  {lang === 'ar' ? (
                    <>
                      الحرمان الشديد يسبب ثبات الوزن، هدم الكتلة العضلية، وفقدان النضارة!
                      <br /><br />
                      المنظومة تعتمد على عجز سعرات مرن يغذي جسمكِ ويحمي كتلتكِ العضلية والأنثوية مع خفض الدهون بإنتاجية وطاقة عالية.
                    </>
                  ) : (
                    <>
                      Severe deprivation leads to weight plateaus, muscle loss, and dull skin!
                      <br /><br />
                      Our system relies on a moderate, nourishing deficit that protects feminine muscle curves and boosts your vitality while stripping away stubborn fat.
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Sculpting & Firming */}
          <div className="animate-on-scroll delay-3 flex flex-col justify-between rounded-4xl p-7 md:p-8 card-dark-glass border border-beige/20 hover:border-gold/50 transition-all duration-400">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center text-xl">
                  ✨
                </span>
                <div>
                  <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                    {t('شد الترهلات والقوام', 'Body Toning & Firming')}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">
                    {t('إعادة تشكيل وتنسيق الجسم', 'Reshaping & Harmonizing Your Silhouette')}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-rose-200/90 font-medium text-xs">
                  <span className="font-bold text-rose-300 block mb-1">
                    {t('❌ الاعتقاد الشائع:', '❌ Common Myth:')}
                  </span>
                  {t(
                    '«ساعات الجري والكارديو اليومي هي الحل الوحيد لشد الجسم!»',
                    '"Endless hours of running and daily cardio are the only way to tone the body!"'
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-gold/30 text-cream/95 font-medium text-xs md:text-sm">
                  <span className="font-bold text-gold block mb-1">
                    {t('✔️ الحقيقة مع الكوتش حنان:', '✔️ The Reality with Coach Hanan:')}
                  </span>
                  {lang === 'ar' ? (
                    <>
                      الكارديو المفرط يسهم في ترهل الجلد. شد القوام وإبراز الأنوثة يحتاجان تمريناً وظيفياً موجهاً يرفع الأرداف والصدر ويحدد الخصر بمرونة وتناسق.
                    </>
                  ) : (
                    <>
                      Excessive cardio contributes to skin laxity and muscle depletion. Sculpting curves and lifting the glutes and chest requires targeted functional resistance training that defines your waistline gracefully.
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Process Conclusion Box */}
        <div className="animate-on-scroll delay-4 max-w-4xl mx-auto">
          <div
            className="rounded-4xl p-8 md:p-10 border relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(31,8,17,0.95) 0%, rgba(63,20,37,0.85) 100%)',
              borderColor: 'rgba(239,208,213,0.25)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
                <HelpCircle size={28} className="text-gold" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white mb-2">
                  {t('كيف نبدأ تقييم حالتكِ؟', 'How Do We Assess Your Case?')}
                </h4>
                <p className="text-sm md:text-base text-cream/90 leading-relaxed font-medium">
                  {t(
                    'لذلك أول خطوة عندي دائماً تكون تقييم حالتكِ من خلال بعض الأسئلة المهمة، حتى أقدر أحدد لكِ الخطة الأنسب لهدفكِ بطريقة واقعية وآمنة ومضمونة.',
                    'That is why my first step is always evaluating your case through key diagnostic questions, allowing me to formulate the most realistic, safe, and effective plan for your goal.'
                  )}
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                  <p className="text-xs md:text-sm text-taupe font-semibold">
                    {t(
                      'بعد إرسال بياناتكِ، أراجع حالتكِ بعناية، وأخبركِ بالنتائج والمدة المتوقعة للوصول لهدفكِ، وبعدها يكون القرار لكِ إذا رغبتِ بالبدء بالاشتراك.',
                      'After submitting your details, I personally review your profile, share your expected timeline to reach your goal, and the choice is completely yours if you wish to enroll.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
