import { ArrowLeft, Sparkles, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalCTA() {
  const navigate = useNavigate();
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 md:py-36 relative overflow-hidden bg-dark-950">
      {/* Background Dark Burgundy Gradients */}
      <div className="absolute inset-0 bg-dark-radial opacity-90" />
      <div className="absolute inset-0 digital-grid-bg opacity-20 pointer-events-none" />

      {/* Decorative Orbs & Geometry */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 opacity-40 blur-3xl animate-pulse-glow pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(186,120,92,0.6) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 opacity-35 blur-3xl animate-float-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }}
      />

      {/* Glowing Accents */}
      <div
        className="absolute top-12 left-12 right-12 h-px opacity-20"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(239,208,213,0.8), transparent)' }}
      />
      <div
        className="absolute bottom-12 left-12 right-12 h-px opacity-20"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(239,208,213,0.8), transparent)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
        {/* Eyebrow */}
        <div className="animate-on-scroll mb-8">
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold shadow-neon-bronze"
            style={{
              background: 'linear-gradient(135deg, rgba(90,33,53,0.8), rgba(63,20,37,0.9))',
              color: '#EFD0D5',
              border: '1px solid rgba(186,120,92,0.5)',
            }}
          >
            <Sparkles size={14} className="text-gold animate-spin" style={{ animationDuration: '4s' }} />
            ابدئي مسار التحول اليوم
          </span>
        </div>

        {/* Main heading */}
        <div className="animate-on-scroll delay-1 mb-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-balance">
            <span className="text-white block">ابدئي من هدفكِ الحقيقي.</span>
            <span
              className="block mt-2"
              style={{
                background: 'linear-gradient(135deg, #F5DCE0 0%, #EFD0D5 40%, #BA785C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              وابني جسمكِ وعاداتكِ
            </span>
            <span className="text-white/90 block mt-1 text-3xl md:text-4xl lg:text-5xl">
              على مسار علمي صُمم لكِ.
            </span>
          </h2>
        </div>

        {/* CTA Button */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/subscribe/plus')}
              className="group inline-flex items-center gap-3 px-10 md:px-14 py-4 md:py-5 rounded-full font-extrabold text-lg md:text-xl transition-all duration-300 shadow-neon-bronze"
              style={{
                background: 'linear-gradient(135deg, #BA785C 0%, #5A2135 60%, #3F1425 100%)',
                color: 'white',
                border: '1px solid rgba(255,250,248,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 60px rgba(186,120,92,0.7)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 40px rgba(186,120,92,0.4)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              سجّلي الآن
              <ArrowLeft
                size={22}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </button>
            <button
              onClick={() => handleScroll('#pricing')}
              className="btn-secondary group inline-flex items-center gap-2"
            >
              عرض الباقات
              <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>

        {/* Sub-tagline */}
        <div className="animate-on-scroll delay-3">
          <p
            className="text-sm md:text-base font-bold tracking-wide text-taupe"
          >
            تغذية ذكية &nbsp;·&nbsp; تدريب موجه &nbsp;·&nbsp; متابعة رقمية &nbsp;·&nbsp; مجتمع نسائي مغلق.
          </p>
        </div>

        {/* Decorative bottom dots */}
        <div className="animate-on-scroll delay-4 mt-16 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i === 2 ? '#BA785C' : 'rgba(239,208,213,0.3)',
                transform: i === 2 ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
