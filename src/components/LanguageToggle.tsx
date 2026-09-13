import { useLang } from '../context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-300 group overflow-hidden ${className}`}
      style={{
        background: 'rgba(186,120,92,0.12)',
        borderColor: 'rgba(186,120,92,0.35)',
      }}
      aria-label="Toggle Language"
    >
      {/* Animated background fill */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(186,120,92,0.18)' }}
      />

      {/* AR indicator */}
      <span
        className={`relative z-10 transition-all duration-300 ${lang === 'ar' ? 'text-gold font-extrabold' : 'text-taupe/60'}`}
      >
        ع
      </span>

      {/* Divider */}
      <span className="relative z-10 text-taupe/30 font-light">|</span>

      {/* EN indicator */}
      <span
        className={`relative z-10 transition-all duration-300 ${lang === 'en' ? 'text-gold font-extrabold' : 'text-taupe/60'}`}
      >
        EN
      </span>

      {/* Active pill indicator */}
      <span
        className="relative z-10 w-1.5 h-1.5 rounded-full bg-gold ml-0.5 animate-pulse"
        style={{ opacity: 0.8 }}
      />
    </button>
  );
}
