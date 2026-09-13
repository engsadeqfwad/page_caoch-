import { outcomes } from '../data';

export default function OutcomesSection() {
  return (
    <section className="py-24 md:py-32 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 digital-grid-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            ثمار التزامكِ
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            النتائج التي{' '}
            <span className="gradient-text">ستشاهدينها مع الالتزام.</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            الالتزام بالمنظومة يضمن لكِ تحولاً جذاباً ملحوظاً في شكل الجسم، مشدوداً بالكامل ومنسقاً بطريقة تزيدكِ ثقة وجاذبية.
          </p>
        </div>

        {/* Outcomes grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-12">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome.id}
              className={`animate-on-scroll delay-${Math.min(index + 1, 6)} group`}
            >
              <div
                className="h-full rounded-3xl p-6 text-center transition-all duration-400 cursor-default hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.85) 100%)',
                  border: '1px solid rgba(239,208,213,0.18)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(90,33,53,0.6)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#BA785C';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(239,208,213,0.18)';
                }}
              >
                <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
                  {outcome.icon}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-cream transition-colors leading-tight">
                  {outcome.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Encouraging Note */}
        <div className="animate-on-scroll delay-4 text-center">
          <div className="inline-block p-6 rounded-2xl bg-dark-800/80 border border-beige/20 text-cream max-w-2xl text-sm font-bold shadow-luxury">
            ✨ التزامكِ بمساركِ الخاص هو مفتاح التحول السريع. النتائج والمقاسات تبدأ بالظهور بوضوح منذ الأسبوع الثالث!
          </div>
        </div>
      </div>
    </section>
  );
}
