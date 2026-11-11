import { ArrowLeft, ArrowRight } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLang } from '../context/language';

export default function WizardTopBar({ 
    onBack, 
    stepLabel, 
    percent,
    showProgress = true,
    disabled = false,
  }: { 
    onBack: () => void; 
    stepLabel: string; 
    percent: number;
    showProgress?: boolean;
    disabled?: boolean;
  }) {
  const { lang, t } = useLang();
  return (
    <div className="relative z-20 max-w-2xl mx-auto w-full pt-4 pb-2">
      <div className="flex items-center justify-between text-xs text-taupe mb-2.5 font-bold">
        {/* Back Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {lang === 'ar' ? <ArrowRight size={16} className="text-gold" /> : <ArrowLeft size={16} className="text-gold" />}
          <span>{t('السابق', 'Back')}</span>
        </button>

        {/* Step Status and Counter in Center */}
        <span className="text-xs md:text-sm font-bold text-white/90">
          {stepLabel}
        </span>

        {/* Progress % and Language Toggle */}
        <div className="flex items-center gap-3">
          {showProgress && (
            <span className="text-xs font-extrabold text-gold">
              {percent}%
            </span>
          )}
          <LanguageToggle />
        </div>
      </div>

      {/* Progress Track Line */}
      {showProgress && (
        <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-gold to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
