"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';

// Ressources par défaut pour fonctionner côté serveur
const defaultResources = {
  en: {
    translation: {
      accueil: 'Home',
      seConnecter: 'Log In',
      sinscrire: 'Sign Up',
      français: 'French',
      english: 'English',
      deutsch: 'German'
    }
  },
  fr: {
    translation: {
      accueil: 'Accueil',
      seConnecter: 'Se connecter',
      sinscrire: 'S\'inscrire',
      français: 'Français',
      english: 'Anglais',
      deutsch: 'Allemand'
    }
  },
  de: {
    translation: {
      accueil: 'Startseite',
      seConnecter: 'Anmelden',
      sinscrire: 'Registrieren',
      français: 'Französisch',
      english: 'Englisch',
      deutsch: 'Deutsch'
    }
  }
};

// Configuration commune pour client et serveur
const i18nConfig = {
  supportedLngs: ['fr', 'en', 'de'],
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    caches: ['cookie', 'localStorage']
  }
};

// Initialisation i18n uniquement côté client
if (typeof window !== 'undefined') {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...i18nConfig,
      backend: {
        loadPath: '/locales/{{lng}}/translation.json'
      }
    });
} else {
  // Côté serveur, utilise les ressources statiques
  i18n
    .use(resourcesToBackend(defaultResources))
    .use(initReactI18next)
    .init(i18nConfig);
}

export default i18n;
