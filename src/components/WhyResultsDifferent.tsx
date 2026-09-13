import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function WhyResultsDifferent() {
  return (
    <section id="why-different" className="py-24 md:py-32 bg-dark-950 relative overflow-hidden">
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
            <Sparkles size={14} className="text-gold animate-spin inline ml-2" style={{ animationDuration: '4s' }} />
            فلسفة المنظومة
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            لماذا النتائج{' '}
            <span className="gradient-text">مختلفة معي؟</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            السر لا يكمن في إعطاء جداول عشوائية، بل في فهم البيولوجيا الفردية لجسمكِ واستجابته الخاصة.
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
              "أحب أوضح لكِ من البداية أنني لا أعمل على نظام جاهز أو عشوائي، لأن كل جسم يختلف عن الآخر في الاستجابة والاحتياج."
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
                  <span className="text-[11px] font-bold text-gold uppercase tracking-wider">زيادة الوزن والامتلاء</span>
                  <h3 className="text-lg font-extrabold text-white">حقيقة الهضم والامتصاص</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-rose-200/90 font-medium text-xs">
                  <span className="font-bold text-rose-300 block mb-1">❌ الاعتقاد الشائع:</span>
                  «حقيقي الحرق عالي أو جيناتي وراثية ما تخليني أزيد لو شو ما أكلت!»
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-gold/30 text-cream/95 font-medium text-xs md:text-sm">
                  <span className="font-bold text-gold block mb-1">✔️ الحقيقة مع الكوتش حنان:</span>
                  لما عرفنا التفاصيل اكتشفنا إن المشكلة مو بالحرق أصلاً ولا بالجينات! لأن لازم الأول جسمكِ يعرف: <strong className="text-white">يهضم، يمتص، ويستفيد من اللي أكلتيه</strong> عشان يقدر يبني عليه ويزيد.
                  <br /><br />
                  عشان كذا الحل مو بس «كلي أكثر»… المهم نعرف السبب ونعالج أصل المشكلة لجسمكِ بنظام غذائي وتوزيع وجبات وروتين مختلف، وهذا هو سبب ظهور النتائج وتحسن الشهية من أول أسبوع.
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
                  <span className="text-[11px] font-bold text-gold uppercase tracking-wider">خسارة الدهون والنحت</span>
                  <h3 className="text-lg font-extrabold text-white">التنحيف الذكي بدون حرمان</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-rose-200/90 font-medium text-xs">
                  <span className="font-bold text-rose-300 block mb-1">❌ الاعتقاد الشائع:</span>
                  «التنحيف يعني الحرمان وجوع الساعات الطويلة وقطع النشويات تماماً!»
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-gold/30 text-cream/95 font-medium text-xs md:text-sm">
                  <span className="font-bold text-gold block mb-1">✔️ الحقيقة مع الكوتش حنان:</span>
                  الحرمان الشديد يسبب ثبات الوزن، هدم الكتلة العضلية، وفقدان النضارة!
                  <br /><br />
                  المنظومة تعتمد على عجز سعرات مرن يغذي جسمكِ ويحمي كتلتكِ العضلية والأنثوية مع خفض الدهون بإنتاجية وطاقة عالية.
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
                  <span className="text-[11px] font-bold text-gold uppercase tracking-wider">شد الترهلات والقوام</span>
                  <h3 className="text-lg font-extrabold text-white">إعادة تشكيل وتنسيق الجسم</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-rose-200/90 font-medium text-xs">
                  <span className="font-bold text-rose-300 block mb-1">❌ الاعتقاد الشائع:</span>
                  «ساعات الجري والكارديو اليومي هي الحل الوحيد لشد الجسم!»
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-gold/30 text-cream/95 font-medium text-xs md:text-sm">
                  <span className="font-bold text-gold block mb-1">✔️ الحقيقة مع الكوتش حنان:</span>
                  الكارديو المفرط يسهم في ترهل الجلد. شد القوام وإبراز الأنوثة يحتاجان تمريناً وظيفياً موجهاً يرفع الأرداف والصدر ويحدد الخصر بمرونة وتناسق.
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
                  كيف نبدأ تقييم حالتكِ؟
                </h4>
                <p className="text-sm md:text-base text-cream/90 leading-relaxed font-medium">
                  لذلك أول خطوة عندي دائماً تكون تقييم حالتكِ من خلال بعض الأسئلة المهمة، حتى أقدر أحدد لكِ الخطة الأنسب لهدفكِ بطريقة واقعية وآمنة ومضمونة.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                  <p className="text-xs md:text-sm text-taupe font-semibold">
                    بعد إرسال بياناتكِ، أراجع حالتكِ بعناية، وأخبركِ بالنتائج والمدة المتوقعة للوصول لهدفكِ، وبعدها يكون القرار لكِ إذا رغبتِ بالبدء بالاشتراك.
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
