import { Language } from '../types';

export const t = (lang: Language, vi: string, en: string) => {
  return lang === 'en' ? en : vi;
};
