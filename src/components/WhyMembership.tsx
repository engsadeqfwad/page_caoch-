export default function WhyMembership() {
  const programItems = [
    { label: 'محتوى ثابت لا ينظر للتطور' },
    { label: 'ينتهي فجأة بلا توجيه مستمر' },
    { label: 'غياب المتابعة بعد الخطة الأولي' },
    { label: 'خطر الجمود وثبات النتائج' },
  ];

  const membershipItems = [
    { label: 'برامج محدثة دورياً بحسب تطوركِ' },
    { label: 'تحديات شهرية حماسية ومحفزة' },
    { label: 'تعليم ومحتوى رقمي حصري متجدد' },
    { label: 'مجتمع نسائي داعم 24/7' },
    { label: 'متابعة قياسات وقوة مستمرة' },
    { label: 'تطوير دائم للمسار لضمان الاستمرارية' },
  ];

  return (
    <section className="py-24 md:py-32 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 digital-grid-bg opacity-15 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            لماذا العضوية الرقمية؟
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            لأن قوامكِ يتطور باستمرار،{' '}
            <span className="gradient-text">وحاجتكِ للنتائج لا تتوقف.</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            البرامج الفردية المؤقتة تسبب ثبات الجسم وفقدان الشغف. العضوية تمنحكِ التطوير المستمر.
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* One-time program */}
          <div className="animate-on-scroll delay-1">
            <div
              className="rounded-4xl p-8 h-full"
              style={{
                background: 'linear-gradient(145deg, rgba(31,8,17,0.8) 0%, rgba(20,4,10,0.95) 100%)',
                border: '1px solid rgba(239,208,213,0.1)',
                boxShadow: '0 4px 25px rgba(0,0,0,0.4)',
              }}
            >
              <div className="mb-6">
                <span
                  className="inline-block px-4 py-2 rounded-full text-xs font-bold text-taupe bg-dark-800/60 border border-beige/10"
                >
                  One-Time Program
                </span>
              </div>
              <h3 className="text-xl font-bold text-white/80 mb-2">برنامج عادي قديم</h3>
              <p className="text-taupe text-sm mb-6 font-medium">النموذج التقليدي المؤقت</p>

              {/* Flow */}
              <div className="space-y-3 mb-6">
                {['خطة ثابتة', 'تنفيذ مؤقت', 'نهاية وسكون النتيجة ↓'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: i === 2 ? 'rgba(200,80,80,0.2)' : 'rgba(239,208,213,0.1)',
                        color: i === 2 ? '#FF7B7B' : '#D9B4BF',
                        border: i === 2 ? '1px solid rgba(200,80,80,0.3)' : '1px solid rgba(239,208,213,0.2)',
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium ${i === 2 ? 'text-red-400 font-semibold' : 'text-taupe'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {programItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(200,80,80,0.15)' }}
                    >
                      <span className="text-red-400 text-xs font-bold">✕</span>
                    </span>
                    <span className="text-sm text-taupe font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Membership */}
          <div className="animate-on-scroll delay-2">
            <div
              className="rounded-4xl p-8 h-full relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #5A2135 0%, #3F1425 60%, #1F0811 100%)',
                border: '1.5px solid rgba(186,120,92,0.4)',
                boxShadow: '0 20px 60px rgba(90,33,53,0.5)',
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 20%, #BA785C 0%, transparent 50%)',
                }}
              />
              <div className="relative z-10">
                <div className="mb-6">
                  <span
                    className="inline-block px-4 py-2 rounded-full text-xs font-bold text-cream"
                    style={{
                      background: 'linear-gradient(135deg, rgba(186,120,92,0.4), rgba(90,33,53,0.6))',
                      border: '1px solid rgba(239,208,213,0.3)',
                    }}
                  >
                    Digital Membership ✦
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">العضوية الرقمية المتكاملة</h3>
                <p className="text-cream/80 text-sm mb-6 font-medium">منظومة متطورة تضمن أسرع التحولات</p>

                {/* Flow */}
                <div className="space-y-2 mb-6">
                  {['خطة مصممة', 'تنفيذ', 'متابعة', 'تطور', 'تحديث', 'قوام أقوى ومشدود ↑'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: i === 5
                            ? 'linear-gradient(135deg, #BA785C, #5A2135)'
                            : 'rgba(239,208,213,0.15)',
                          color: 'white',
                          boxShadow: i === 5 ? '0 4px 15px rgba(186,120,92,0.5)' : 'none',
                        }}
                      >
                        {i + 1}
                      </div>
                      <span className={`text-sm font-medium ${i === 5 ? 'text-cream font-bold' : 'text-taupe'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {membershipItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #BA785C, #5A2135)' }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm text-white font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
