import { useAuthStore } from '@/stores/authStore';

export type AppLanguage = 'en' | 'es';

type TranslationVars = Record<string, string | number>;

export const resolveAppLanguage = (value?: string | null): AppLanguage =>
  value === 'es' ? 'es' : 'en';

export const useAppLanguage = (override?: string | null): AppLanguage => {
  const storedLanguage = useAuthStore((state) => state.user?.profileConfig?.appLanguage);
  return resolveAppLanguage(override ?? storedLanguage);
};

export const useTranslations = <K extends string>(
  translations: Record<AppLanguage, Record<K, string>>,
  override?: string | null
) => {
  const language = useAppLanguage(override);
  const t = (key: K, vars?: TranslationVars) => {
    const template = translations[language][key] ?? translations.en[key];
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
  };

  return { t, language };
};
