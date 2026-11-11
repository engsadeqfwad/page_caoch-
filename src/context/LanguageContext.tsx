import { useEffect, useState, type ReactNode } from 'react';
import { LanguageContext, type Lang } from './language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return localStorage.getItem('lang') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; }
  });
  const setLang = (value: Lang) => {
    setLangState(value);
    try { localStorage.setItem('lang', value); } catch { /* Storage may be disabled. */ }
  };
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);
  const t = <T,>(ar: T, en: T): T => lang === 'ar' ? ar : en;
  return <LanguageContext.Provider value={{ lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>{children}</LanguageContext.Provider>;
}
