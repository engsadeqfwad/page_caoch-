export default function ConceptSection() {
  const steps = [
    { label: 'هدفكِ', en: 'Goal', icon: '🎯' },
    { label: 'تقييم المستوى', en: 'Assessment', icon: '📊' },
    { label: 'مساركِ', en: 'Path', icon: '🗺️' },
    { label: 'تغذية ذكية', en: 'Nutrition', icon: '🌿' },
    { label: 'تدريب منهجي', en: 'Training', icon: '💪' },
    { label: 'تحول حقيقي', en: 'Results', icon: '⚡' },
  ];

  return (
    <section className="py-24 md:py-32 bg-dark-950 relative overflow-hidden">
      {/* Background digital grids & glow */}
      <div className="absolute inset-0 digital-grid-bg opacity-20 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(186,120,92,0.7) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            رؤية المنظومة
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-6">
            ليست خطة عشوائية للجميع.{' '}
            <span className="gradient-text block mt-2">بل هندسة دقيقة لقوامكِ.</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            كل مسار في المنظومة يحتوي على <strong className="text-cream">برنامج غذائي مرن + برنامج تمارين مخصص (سواء في المنزل أو الجيم)</strong> صُمم بدقة ليلائم هدفكِ الحالي ومستوى نشاطكِ.
          </p>
        </div>

        {/* Digital Flow Diagram */}
        <div className="animate-on-scroll delay-2 flex flex-wrap justify-center items-center gap-4 md:gap-0 mb-20">
          {steps.map((step, index) => (
            <div key={step.en} className="flex items-center">
              {/* Step Card */}
              <div className="flex flex-col items-center text-center group cursor-default">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-3 transition-all duration-400 group-hover:scale-110 relative"
                  style={{
                    background: index === steps.length - 1
                      ? 'linear-gradient(135deg, #BA785C, #5A2135)'
                      : 'linear-gradient(145deg, rgba(63,20,37,0.8), rgba(31,8,17,0.9))',
                    border: index === steps.length - 1
                      ? '1px solid rgba(255,250,248,0.4)'
                      : '1px solid rgba(239,208,213,0.2)',
                    boxShadow: index === steps.length - 1
                      ? '0 8px 30px rgba(186,120,92,0.5)'
                      : '0 4px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  <span className="relative z-10">{step.icon}</span>
                  {index === steps.length - 1 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-ping" />
                  )}
                </div>
                <p className="text-sm font-bold text-white mb-0.5">{step.label}</p>
                <p className="text-[10px] text-taupe tracking-wider font-semibold uppercase">{step.en}</p>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center mx-2 lg:mx-4">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gold/40"
                        style={{ opacity: 1 - i * 0.25 }}
                      />
                    ))}
                  </div>
                  <svg
                    width="14" height="14"
                    viewBox="0 0 12 12"
                    className="text-gold mr-1 -scale-x-100"
                  >
                    <path
                      d="M1 6h10M6 1l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom message banner */}
        <div className="animate-on-scroll delay-3 max-w-3xl mx-auto text-center">
          <div
            className="inline-block p-8 md:p-10 rounded-4xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.9) 100%)',
              border: '1px solid rgba(239,208,213,0.25)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 30%, #BA785C 0%, transparent 60%)',
              }}
            />
            <p className="relative z-10 text-xl md:text-2xl font-bold text-white leading-relaxed">
              "بدل أن تضيعي وقتكِ في تجربة جداول لا تناسبكِ،{' '}
              <span className="gradient-text block md:inline mt-1 md:mt-0">ابدئي مباشرة من المسار المصمم لهدفكِ."</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
