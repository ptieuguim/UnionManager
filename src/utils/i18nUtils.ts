import { useTranslation } from 'react-i18next';

/**
 * Hook personnalisé pour accéder à l'instance i18n
 * @returns l'instance i18n pour accéder aux fonctionnalités comme language
 */
export const useI18n = () => {
  const { i18n } = useTranslation();
  return i18n;
};
