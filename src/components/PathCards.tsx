import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paths } from '../data';
import { useLang } from '../context/LanguageContext';

const pathColors: Record<string, { gradient: string; accent: string; badgeBg: string }> = {
  'feminine-shape': { gradient: 'linear-gradient(135deg, #BA785C 0%, #5A2135 100%)', accent: '#EFD0D5', badgeBg: 'rgba(186,120,92,0.25)' },
  'weight-gain': { gradient: 'linear-gradient(135deg, #5A2135 0%, #3F1425 100%)', accent: '#F5DCE0', badgeBg: 'rgba(90,33,53,0.4)' },
  'fat-loss': { gradient: 'linear-gradient(135deg, #BA785C 0%, #EFD0D5 100%)', accent: '#EFD0D5', badgeBg: 'rgba(186,120,92,0.25)' },
  'recomposition': { gradient: 'linear-gradient(135deg, #5A2135 0%, #BA785C 100%)', accent: '#F5DCE0', badgeBg: 'rgba(90,33,53,0.4)' },
  'glute-lower': { gradient: 'linear-gradient(135deg, #BA785C 0%, #5A2135 100%)', accent: '#EFD0D5', badgeBg: 'rgba(186,120,92,0.25)' },
  'home-transformation': { gradient: 'linear-gradient(135deg, #5A2135 0%, #3F1425 100%)', accent: '#F5DCE0', badgeBg: 'rgba(90,33,53,0.4)' },
  'therapeutic-health': { gradient: 'linear-gradient(135deg, #BA785C 0%, #5A2135 100%)', accent: '#EFD0D5', badgeBg: 'rgba(186,120,92,0.25)' },
};

export default function PathCards() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const { lang, t, dir } = useLang();

  return (
    <section id="paths" className="py-24 md:py-32 bg-dark-900 relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 digital-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(186,120,92,0.7) 0%, transparent 70%)' }} />

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            {t('المسارات المتخصصة', 'Specialized Paths')}
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-6">
            {lang === 'ar' ? (
              <>
                حدد هدفكِ.{' '}
                <span className="gradient-text">وانطلقي في مساركِ المصمم.</span>
              </>
            ) : (
              <>
                Define Your Goal.{' '}
                <span className="gradient-text">Launch Your Tailored Path.</span>
              </>
            )}
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            {t(
              'سبعة مسارات رقمية متخصصة، كل مسار يقدم منظومة متكاملة تضمن أسرع وأدق النتائج المستدامة.',
              'Seven specialized digital paths — each offering a complete system that guarantees the fastest and most precise sustainable results.'
            )}
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {paths.map((path, index) => {
            const colors = pathColors[path.id] || pathColors['feminine-shape'];
            const isActive = activeCard === path.id;

            return (
              <div
                key={path.id}
                className={`animate-on-scroll delay-${Math.min(index + 1, 6)} path-card cursor-pointer group`}
                style={{
                  background: 'linear-gradient(145deg, rgba(63,20,37,0.75) 0%, rgba(31,8,17,0.9) 100%)',
                  borderRadius: '1.75rem',
                  border: isActive ? '1.5px solid rgba(186,120,92,0.8)' : '1px solid rgba(239,208,213,0.18)',
                  boxShadow: isActive ? '0 15px 50px rgba(90,33,53,0.6)' : '0 8px 30px rgba(0,0,0,0.4)',
                }}
                onClick={() => setActiveCard(isActive ? null : path.id)}
                onMouseEnter={() => setActiveCard(path.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Card top gradient bar */}
                <div className="h-1.5 w-full" style={{ background: colors.gradient, borderRadius: '1.75rem 1.75rem 0 0' }} />

                <div className="p-6 md:p-8">
                  {/* Number + Badge row */}
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-4xl font-extrabold text-gold/30" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {path.number}
                    </span>
                    <div className="flex flex-col items-end gap-2">
                      {path.badge && (
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full text-gold border border-gold/40" style={{ background: colors.badgeBg }}>
                          ✓ {lang === 'en' && path.badgeEn ? path.badgeEn : path.badge}
                        </span>
                      )}
                      <span className="text-[11px] font-bold tracking-widest uppercase text-gold">
                        {lang === 'ar' ? path.subtitle : (path.subtitleAr || path.title)}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-cream transition-colors">
                    {lang === 'ar' ? path.title : (path.titleEn || path.subtitle)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-taupe leading-relaxed mb-6 font-medium">
                    {lang === 'en' && path.descriptionEn ? path.descriptionEn : path.description}
                  </p>

                  {/* Goals */}
                  <div className="space-y-2.5 mb-6">
                    {(lang === 'en' && path.goalsEn ? path.goalsEn : path.goals).map((goal) => (
                      <div key={goal} className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #BA785C, #5A2135)' }}>
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-sm text-white/90 font-medium">{goal}</span>
                      </div>
                    ))}
                  </div>

                  {/* Training tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {path.training.map((tag) => (
                      <span key={tag} className="text-[11px] px-3 py-1 rounded-full font-semibold text-cream bg-dark-800/80 border border-beige/15">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className="flex items-center gap-2 text-sm font-bold text-gold group-hover:text-white transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {t('انطلقي في هذا المسار', 'Start This Path')}
                    {lang === 'ar'
                      ? <ChevronLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                      : <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
