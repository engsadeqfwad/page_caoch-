import { progressMetrics } from '../data';

export default function ProgressSection() {
  return (
    <section className="py-24 md:py-32 bg-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 digital-dots-bg opacity-20 pointer-events-none" />
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll section-badge inline-block mb-6">Multidimensional Transformation</div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            التحول الحقيقي ينعكس في{' '}
            <span className="gradient-text">جميع تفاصيل قوامكِ وقوتكِ.</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            الميزان ليس سوى رقم واحد. المنظومة تضمن لكِ تحولاً متكاملاً في المقاسات، نحت القوام، ومستويات الطاقة من الأسابيع الأولى.
          </p>
        </div>

        {/* Main visual Grid */}
        <div className="animate-on-scroll delay-2 mb-12">
          <div
            className="rounded-4xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.9) 100%)',
              border: '1px solid rgba(239,208,213,0.2)',
              boxShadow: '0 15px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Background glowing rings */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none"
              style={{ border: '2px stroke #BA785C', backgroundImage: 'radial-gradient(circle, rgba(186,120,92,0.2) 0%, transparent 70%)' }}
            />

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {progressMetrics.map((metric, index) => (
                <div
                  key={metric.id}
                  className="group text-center p-5 md:p-6 rounded-3xl transition-all duration-400 hover:-translate-y-2"
                  style={{
                    background: 'rgba(20,4,10,0.7)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(239,208,213,0.15)',
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 mx-auto transition-transform duration-300 group-hover:scale-110 shadow-neon-rose"
                    style={{
                      background: 'linear-gradient(135deg, rgba(90,33,53,0.8), rgba(63,20,37,0.6))',
                    }}
                  >
                    {getMetricIcon(metric.id)}
                  </div>
                  <h4 className="font-bold text-white text-sm md:text-base mb-1 group-hover:text-cream transition-colors">{metric.label}</h4>
                  <p className="text-[11px] md:text-xs text-taupe leading-relaxed font-medium">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="animate-on-scroll delay-3 max-w-3xl mx-auto">
          <div
            className="rounded-3xl p-6 md:p-8 text-center border border-gold/30 shadow-neon-bronze"
            style={{
              background: 'linear-gradient(135deg, rgba(90,33,53,0.6), rgba(31,8,17,0.8))',
            }}
          >
            <div className="text-2xl mb-3">🔥</div>
            <p className="text-sm md:text-base text-cream leading-relaxed font-bold">
              الالتزام بالمنظومة يضمن لكِ تحولاً جذاباً ملحوظاً في شكل الجسم، مشدوداً بالكامل ومنسقاً بطريقة تزيدكِ ثقة وجاذبية.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function getMetricIcon(id: string): string {
  const icons: Record<string, string> = {
    weight: '⚖️',
    measurements: '📏',
    strength: '⚡',
    endurance: '🏃‍♀️',
    energy: '☀️',
    consistency: '✅',
    composition: '📊',
    confidence: '⭐',
  };
  return icons[id] || '📈';
}
