const trainingCategories = [
  {
    title: 'مكان التدريب',
    items: [
      { label: 'Home Training', ar: 'تدريب منزلي متقدم', icon: '🏠' },
      { label: 'Gym Training', ar: 'تدريب احترافي بالجيم', icon: '🏋️' },
    ],
  },
  {
    title: 'المستوى',
    items: [
      { label: 'Beginner', ar: 'مبتدئة', icon: '🌱' },
      { label: 'Intermediate', ar: 'متوسطة', icon: '🌿' },
      { label: 'Advanced', ar: 'متقدمة', icon: '🌳' },
    ],
  },
  {
    title: 'مناطق التدريب',
    items: [
      { label: 'Lower Body', ar: 'الجزء السفلي', icon: '🦵' },
      { label: 'Core', ar: 'العضلة الوسطى', icon: '⚡' },
      { label: 'Full Body', ar: 'كامل الجسم', icon: '✨' },
      { label: 'Glutes', ar: 'الأرداف والمؤخرة', icon: '🎯' },
    ],
  },
  {
    title: 'منهجية التطوير',
    items: [
      { label: 'Progressive Overload', ar: 'التدرج التحميلي المستمر', icon: '📈' },
      { label: 'Technique', ar: 'إتقان الأسلوب الحركي', icon: '🎓' },
      { label: 'Mobility', ar: 'المرونة والانسيابية', icon: '🤸‍♀️' },
    ],
  },
];

export default function TrainingSection() {
  return (
    <section id="training" className="py-24 md:py-32 bg-dark-900 relative overflow-hidden">
      {/* Decorative vertical line */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-48 rounded-full"
        style={{ background: 'linear-gradient(to bottom, transparent, #BA785C, transparent)' }}
      />
      <div className="absolute inset-0 digital-dots-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <div className="animate-on-scroll section-badge inline-block mb-6">Progressive Training</div>
            <h2 className="animate-on-scroll delay-1 section-heading mb-4">
              تدريب علمي موجه للهدف،{' '}
              <span className="gradient-text block mt-1">يحفز إعادة تشكيل قوامكِ.</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="animate-on-scroll delay-2 section-subheading">
              برامج تدريبية مدروسة بالدقيقة والتكرار. تتطور معكِ أسبوعاً بعد أسبوع لتضمن لكِ أسرع استجابة عضلية وتناسق أنثوي جذاب.
            </p>
          </div>
        </div>

        {/* Training categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {trainingCategories.map((cat, catIndex) => (
            <div
              key={cat.title}
              className={`animate-on-scroll delay-${catIndex + 1} rounded-3xl p-6 md:p-8`}
              style={{
                background: 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.85) 100%)',
                border: '1px solid rgba(239,208,213,0.18)',
                boxShadow: '0 4px 25px rgba(0,0,0,0.4)',
              }}
            >
              <h3 className="text-sm font-bold text-gold tracking-widest uppercase mb-5">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-default border border-beige/15 hover:border-gold/50"
                    style={{
                      background: 'rgba(20,4,10,0.7)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.ar}</p>
                      <p className="text-[10px] text-taupe font-semibold tracking-wide">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progressive development banner */}
        <div
          className="animate-on-scroll delay-3 rounded-4xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #5A2135 0%, #3F1425 50%, #1F0811 100%)',
            border: '1px solid rgba(239,208,213,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #BA785C 0%, transparent 50%), radial-gradient(circle at 80% 50%, #EFD0D5 0%, transparent 50%)',
            }}
          />
          <div className="relative z-10">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">Progressive Overload Engine</p>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
              خطة تتصاعد وتتطور لتضمن نتائج مستمرة
            </h3>
            <p className="text-taupe max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
              السر في التغير الجسدي السريع ليس العشوائية، بل التصاعد المنظم في الشدة والتكرارات لضمان استمرار التحول بدون ثبات الوزن أو القوام.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['المرحلة 1: بناء الأساس', 'المرحلة 2: نحت القوام', 'المرحلة 3: زيادة الكثافة', 'المرحلة 4: التناسق الأقصى'].map((phase, i) => (
                <div
                  key={phase}
                  className="flex items-center gap-2"
                >
                  <div
                    className="px-5 py-2.5 rounded-full text-xs md:text-sm font-bold"
                    style={{
                      background: i === 0
                        ? 'linear-gradient(135deg, #BA785C, #5A2135)'
                        : 'rgba(20,4,10,0.6)',
                      color: 'white',
                      border: i === 0 ? '1px solid rgba(255,250,248,0.4)' : '1px solid rgba(239,208,213,0.2)',
                    }}
                  >
                    {phase}
                  </div>
                  {i < 3 && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="-scale-x-100">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="#BA785C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
