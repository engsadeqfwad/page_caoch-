import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';
import LanguageToggle from './LanguageToggle';
import { useLang } from '../context/LanguageContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, t } = useLang();

  const navLinks = [
    { label: t('المسارات', 'Paths'), href: '#paths' },
    { label: t('التغذية', 'Nutrition'), href: '#nutrition' },
    { label: t('كيف تعمل', 'How It Works'), href: '#journey' },
    { label: t('الأسئلة', 'FAQ'), href: '#faq' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark-950/90 backdrop-blur-xl shadow-luxury-lg border-b border-beige/15 py-2'
            : 'bg-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Image */}
            <a
              href="#"
              className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-neon-rose group-hover:border-gold transition-colors">
                <img
                  src={logoImg}
                  alt="Coach Hanan Khalid Logo"
                  className="h-10 md:h-12 w-auto object-contain rounded-full"
                />
              </div>
              <div className={`flex flex-col leading-tight ${lang === 'en' ? 'text-left' : 'text-right'}`}>
                <span className="text-base md:text-lg font-bold text-white tracking-wide">
                  {t('د/ك : حنان خالد', 'Coach: Hanan Khalid')}
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gold">
                  Women's Fitness Coach
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-sm font-semibold text-beige/80 hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gradient-to-r from-gold to-beige transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* CTA + Language Toggle + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Toggle — always visible */}
              <LanguageToggle />

              <button
                onClick={() => handleLinkClick('#paths')}
                className="hidden md:inline-flex btn-primary text-sm px-6 py-2.5 shadow-neon-bronze"
              >
                {t('اكتشفي مساركِ', 'Find Your Path')}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-white bg-dark-800/80 border border-beige/20 hover:bg-dark-700 transition-colors"
                aria-label={t('قائمة التنقل', 'Navigation menu')}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-dark-900/98 backdrop-blur-2xl border-t border-beige/15 px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`block w-full px-4 py-3 text-white font-semibold rounded-xl hover:bg-dark-800 transition-colors duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3">
              <button
                onClick={() => handleLinkClick('#paths')}
                className="w-full btn-primary"
              >
                {t('اكتشفي مساركِ', 'Find Your Path')}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
