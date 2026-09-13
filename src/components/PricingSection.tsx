import { useNavigate } from 'react-router-dom';
import { pricingTiers } from '../data';
import { Check, Sparkles } from 'lucide-react';

export default function PricingSection() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-24 md:py-32 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 digital-grid-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            مستويات العضوية الرقمية
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            انطلقي بالخيار{' '}
            <span className="gradient-text">الذي يلائم طموحكِ.</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            جميع الباقات شاملة وتتضمن كل ما تحتاجينه للتحول الكامل والوصول لهدفكِ — والاختلاف فقط في <strong className="text-cream font-bold">مدة الاشتراك والرحلة</strong>.
          </p>

          {/* Guarantee / Full Coverage Banner */}
          <div
            className="animate-on-scroll delay-3 inline-flex items-center gap-3 mt-6 px-6 py-3.5 rounded-full shadow-neon-bronze"
            style={{
              background: 'linear-gradient(135deg, rgba(90,33,53,0.85), rgba(63,20,37,0.95))',
              border: '1px solid rgba(186,120,92,0.5)',
            }}
          >
            <Sparkles size={16} className="text-gold animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs md:text-sm font-extrabold text-cream">
              شاملة: تغذية مخصصة + خطة تمارين (منزل/جيم) + متابعة يومية + تعديل دوري للبرنامج
            </span>
          </div>
        </div>

        {/* Pricing cards - 2 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.id}
              className={`animate-on-scroll delay-${index + 1} relative`}
            >
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-extrabold text-white whitespace-nowrap z-10 shadow-neon-bronze"
                style={{ background: 'linear-gradient(135deg, #BA785C, #5A2135)' }}
              >
                ✦ {tier.duration}
              </div>

              <div
                className="h-full rounded-4xl overflow-hidden transition-all duration-500 hover:-translate-y-2 mt-4 md:mt-0 flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(160deg, #5A2135 0%, #3F1425 60%, #1F0811 100%)',
                  border: '2px solid rgba(186,120,92,0.6)',
                  boxShadow: '0 20px 60px rgba(90,33,53,0.6)',
                }}
              >
                {/* Top gradient bar */}
                <div
                  className="h-1.5"
                  style={{ background: 'linear-gradient(90deg, #BA785C, #EFD0D5)' }}
                />

                <div className="p-7 md:p-8 flex flex-col h-full justify-between">
                  <div>
                    {/* Tier name */}
                    <div className="mb-1 pt-2">
                      <span className="text-xs font-extrabold tracking-widest uppercase text-gold">
                        {tier.nameEn}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-taupe mb-6 font-medium leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Price */}
                    <div
                      className="rounded-2xl p-4 mb-6"
                      style={{
                        background: 'rgba(186,120,92,0.12)',
                        border: '1px solid rgba(186,120,92,0.3)',
                      }}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-extrabold text-white">{tier.priceSAR}</span>
                        <span className="text-sm text-taupe font-bold">ريال سعودي</span>
                        <span className="text-xs text-taupe/40 mx-1">|</span>
                        <span className="text-base font-bold text-gold">{tier.priceUSD}$</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="text-xs text-cream font-semibold">المدة: {tier.duration}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {tier.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              background: 'linear-gradient(135deg, #BA785C, #5A2135)',
                            }}
                          >
                            <Check size={11} className="text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm text-white/95 font-medium leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/subscribe/${tier.id}`)}
                    className="w-full py-4 rounded-2xl text-sm font-extrabold transition-all duration-300 btn-primary shadow-neon-bronze mt-4"
                  >
                    سجّلي الآن في هذه الباقة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="animate-on-scroll delay-4 text-center mt-12">
          <p className="text-sm text-taupe font-medium">
            🔒 التسجيل متاح الآن للمجموعات القادمة — اختيار الباقة يتيح لكِ تعبئة بياناتكِ وتقييم حالتكِ مباشرة.
          </p>
        </div>
      </div>
    </section>
  );
}
