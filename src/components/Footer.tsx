import { Mail } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useLang } from '../context/LanguageContext';

const socialLinks = [
  { label: 'Instagram', icon: '📸', href: '#' },
  { label: 'TikTok', icon: '🎵', href: '#' },
  { label: 'Email', icon: <Mail size={18} className="text-gold" />, href: 'mailto:hanankhalid7750@gmail.com', isMail: true },
];

export default function Footer() {
  const { lang, t, dir } = useLang();

  const navLinks = [
    { labelAr: 'المسارات', labelEn: 'Paths', href: '#paths' },
    { labelAr: 'التغذية', labelEn: 'Nutrition', href: '#nutrition' },
    { labelAr: 'كيف تعمل', labelEn: 'How It Works', href: '#journey' },
    { labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ', href: '#faq' },
  ];

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-dark-950" dir={dir}>
      {/* Top gradient separator */}
      <div className="h-px w-full opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #BA785C, transparent)' }} />

      {/* Decorative radial blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-15 pointer-events-none blur-3xl" style={{ background: 'radial-gradient(circle, #5A2135 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Main footer content */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-neon-rose">
                <img src={logoImg} alt="Coach Hanan Khalid Logo" className="h-12 w-auto object-contain rounded-full" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-white tracking-wide">د/ك : حنان خالد</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gold">Women's Fitness Coach</span>
              </div>
            </div>

            <p className="text-sm text-taupe leading-relaxed max-w-xs font-medium mb-6">
              {t(
                'منظومة نسائية رقمية متكاملة للتغذية الذكية، التدريب المنهجي، وبناء نمط حياة أنثوي أقوى وأكثر تناسقاً.',
                'A complete women\'s digital system for smart nutrition, systematic training, and building a stronger, more balanced feminine lifestyle.'
              )}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'rgba(63,20,37,0.6)', border: '1px solid rgba(239,208,213,0.2)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(186,120,92,0.3)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#BA785C'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(63,20,37,0.6)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(239,208,213,0.2)'; }}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-gold uppercase mb-5">
              {t('الأقسام الرئيسية', 'Main Sections')}
            </h4>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleScroll(link.href)}
                  className={`block text-sm text-taupe hover:text-white transition-colors duration-200 font-medium ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  {lang === 'ar' ? link.labelAr : link.labelEn}
                </button>
              ))}
            </nav>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-gold uppercase mb-5">
              {t('التواصل والمعلومات', 'Contact & Information')}
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:hanankhalid7750@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-taupe hover:text-white transition-colors duration-200 font-medium"
                title={t('تواصل عبر البريد الإلكتروني', 'Contact via Email')}
              >
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mail size={14} className="text-gold" />
                </span>
                <span>{t('تواصل معنا عبر الإيميل', 'Contact Us via Email')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(239,208,213,0.1)' }}>
          <p className={`text-xs text-taupe/60 text-center ${lang === 'ar' ? 'md:text-right' : 'md:text-left'} font-medium`}>
            © 2025 د/ك : حنان خالد - Women's Fitness Coach. {t('جميع الحقوق محفوظة.', 'All Rights Reserved.')}
          </p>
          <p className="text-xs text-gold font-bold text-center">
            {t('منظومة رقمية صُممت خصيصاً للمرأة ✦', 'A digital system designed exclusively for women ✦')}
          </p>
        </div>
      </div>
    </footer>
  );
}
