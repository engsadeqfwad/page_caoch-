import { createContext, useContext } from 'react';

export type Lang = 'ar' | 'en';
export const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: <T>(ar: T, en: T) => T;
  dir: 'rtl' | 'ltr';
}>({ lang: 'ar', setLang: () => {}, t: (ar) => ar, dir: 'rtl' });

export const useLang = () => useContext(LanguageContext);
