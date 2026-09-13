import { ArrowLeft, ChevronDown, Sparkles } from 'lucide-react';
import heroImg from '../assets/image.png';

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-950 pt-20">
      {/* Dark Burgundy Radial Glow Background */}
      <div className="absolute inset-0 bg-dark-radial" />
      <div className="absolute inset-0 digital-grid-bg opacity-30" />

      {/* Floating Glowing Spheres / Bubbles */}
      <div
        className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-40 blur-3xl animate-pulse-glow pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl animate-float-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(186,120,92,0.6) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(239,208,213,0.3) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-24 lg:pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-right">
            {/* Digital Badge */}
            <div className="animate-on-scroll mb-8">
              <span className="section-badge border-gold/40">
                <Sparkles size={14} className="text-gold animate-spin" style={{ animationDuration: '4s' }} />
                منظومة التحول الرقمية النسائية المتكاملة
              </span>
            </div>

            {/* Main Heading */}
            <div className="animate-on-scroll delay-1 mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight text-balance">
                جسمكِ لا يحتاج{' '}
                <span className="block text-cream">إلى خطة عشوائية.</span>
                <span className="block mt-2">
                  يحتاج إلى{' '}
                  <span className="relative inline-block">
                    <span className="gradient-text">مسار ذكي صُمم لكِ.</span>
                    <span
                      className="absolute -bottom-1 right-0 left-0 h-1 rounded-full shadow-neon-bronze"
                      style={{ background: 'linear-gradient(90deg, #BA785C, #EFD0D5)' }}
                    />
                  </span>
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <div className="animate-on-scroll delay-2 mb-10">
              <p className="text-lg md:text-xl text-taupe leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                منظومة نسائية متكاملة تدمج بين التغذية الذكية، التدريب المنهجي، والمتابعة الحثيثة —
                لتمكينكِ من بناء قوام أنثوي مشدود، متناسق، وقوي من الأسابيع الأولى مع الالتزام بالمسار.
              </p>
            </div>

            {/* CTAs */}
            <div className="animate-on-scroll delay-3 flex flex-wrap justify-center lg:justify-start gap-4 mb-12 w-full">
              <button
                onClick={() => handleScroll('#paths')}
                className="btn-primary group"
              >
                اكتشفي مساركِ
                <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
              <button
                onClick={() => handleScroll('#why-different')}
                className="btn-secondary group"
              >
                لماذا النتائج مختلفة معي؟
                <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>

            {/* Stats */}
            <div className="animate-on-scroll delay-4 flex justify-center lg:justify-start gap-8 pt-8 border-t border-beige/15 w-full">
              {[
                { number: '7', label: 'مسارات احترافية' },
                { number: '6', label: 'أنظمة غذائية مرنة' },
                { number: '100%', label: 'منظومة نسائية متكاملة' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold gradient-text mb-1">{stat.number}</div>
                  <div className="text-xs md:text-sm text-taupe font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual — Dark Digital Geometric Frame */}
          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Glowing Outer Hexagonal Pattern Frame */}
              <div
                className="absolute inset-0 rounded-5xl opacity-80"
                style={{
                  background: 'linear-gradient(135deg, rgba(186,120,92,0.5) 0%, rgba(90,33,53,0.8) 50%, rgba(239,208,213,0.3) 100%)',
                  transform: 'rotate(2deg) scale(1.03)',
                  borderRadius: '2.5rem',
                  filter: 'blur(1px)',
                }}
              />

              {/* Main Card Frame */}
              <div
                className="relative rounded-5xl overflow-hidden aspect-[4/5] shadow-luxury-lg border border-beige/25"
                style={{ boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)' }}
              >
                {/* Background Gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(160deg, #3F1425 0%, #5A2135 40%, #1F0811 80%, #14040A 100%)',
                  }}
                />
                <div className="absolute inset-0 digital-dots-bg opacity-30" />

                {/* Image Asset */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={heroImg}
                    alt="Coach Hanan Khalid - Women's Digital System"
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(20,4,10,0.6) 100%)',
                    }}
                  />
                </div>

                {/* Glass overlay bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(to top, rgba(20,4,10,0.9) 0%, transparent 100%)',
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                    <p className="text-white text-sm font-bold tracking-wide">
                      تغذية · تدريب · متابعة · مجتمع
                    </p>
                  </div>
                  <p className="text-xs text-taupe text-center">منظومة رقمية متكاملة تضمن أعلى معدلات التحول</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] text-taupe tracking-widest uppercase font-semibold">استكشفي المنظومة</span>
        <ChevronDown size={18} className="text-gold" />
      </div>
    </section>
  );
}
