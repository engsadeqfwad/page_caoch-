import { nutritionCards } from '../data';
import { useLang } from '../context/LanguageContext';

export default function NutritionSection() {
  const { lang, t, dir } = useLang();

  return (
    <section id="nutrition" className="py-24 md:py-32 bg-dark-950 relative overflow-hidden" dir={dir}>
      {/* Background digital grid & light blobs */}
      <div className="absolute inset-0 digital-grid-bg opacity-20 pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] opacity-25 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-20 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(186,120,92,0.6) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            {t('استراتيجية التغذية الذكية', 'Smart Nutrition Strategy')}
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            {lang === 'ar' ? (
              <>
                تغذيتكِ استراتيجية نمو،{' '}
                <span className="gradient-text">وليست حرماناً.</span>
              </>
            ) : (
              <>
                Your Nutrition is a Growth Strategy,{' '}
                <span className="gradient-text">Not Deprivation.</span>
              </>
            )}
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            {t(
              'التغذية الذكية هي وقود التحول الجسدي. نمنحكِ أنظمة مرنة ومحسوبة بدقة لضمان أعلى مستويات الطاقة وسرعة استجابة الجسم.',
              'Smart nutrition is the true engine of physical transformation. We formulate flexible, scientifically calculated plans ensuring peak daily energy and rapid body response.'
            )}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutritionCards.map((card, index) => (
            <div
              key={card.id}
              className={`animate-on-scroll delay-${Math.min(index + 1, 6)} group`}
            >
              <div
                className="h-full rounded-3xl p-7 transition-all duration-400 border border-beige/15 hover:border-gold/50 cursor-default"
                style={{
                  background: 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.85) 100%)',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 45px rgba(90,33,53,0.5)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Icon Container */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-neon-rose"
                  style={{
                    background: 'linear-gradient(135deg, rgba(90,33,53,0.8), rgba(63,20,37,0.6))',
                    border: '1px solid rgba(239,208,213,0.3)',
                  }}
                >
                  {card.icon}
                </div>

                {/* Subtitle tag */}
                <div className="mb-2">
                  <span className="text-[11px] font-bold tracking-widest text-gold uppercase">
                    {lang === 'ar' ? card.titleEn : card.title}
                  </span>
                </div>

                {/* Main Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-cream transition-colors">
                  {lang === 'ar' ? card.title : card.titleEn}
                </h3>

                {/* Description */}
                <p className="text-sm text-taupe leading-relaxed font-medium">
                  {lang === 'en' && card.descriptionEn ? card.descriptionEn : card.description}
                </p>

                {/* Bottom glowing accent line */}
                <div
                  className="mt-6 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ background: 'linear-gradient(90deg, #BA785C, #EFD0D5, transparent)' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom feature note */}
        <div className="animate-on-scroll delay-3 mt-12 text-center">
          <div
            className="inline-block px-8 py-4 rounded-2xl text-sm text-cream font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(90,33,53,0.6), rgba(31,8,17,0.8))',
              border: '1px solid rgba(239,208,213,0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            {t(
              '💡 خطط غذائية مرنة ومصممة بأطعمة بلدكِ — سهولة وسرعة في التطبيق بدون تكاليف إضافية',
              '💡 Flexible nutrition plans crafted with groceries from your own country — effortless and sustainable without extra expenses'
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
