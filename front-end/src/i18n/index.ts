import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const STORAGE_KEY = "lang";

const resources = {
  en: {
    translation: {
      appTitle: "Focus Plan",
      subtitle: "One thought → one actionable plan",
      freeLeft: "free",
      leftCardTitle: "What’s on your mind right now?",
      leftCardDescription:
        "Describe the chaos in words. We’ll turn it into a clear 3–5 step plan.",
      generate: "Generate plan",
      tipLeft: "Tip: The more honest and simple the text, the better the plan.",
      fast: "Fast",
      deep: "Deep",
      strict: "Strict",
      soft: "Soft",
      timeEstimates: "Time estimates",
      regenerate: "Regenerate",
      upgrade: "Upgrade",
      upgradeDescription: "Billing coming soon. You’re on free plan (3/day)",
      save: "Save",
      clear: "Clear",
      placeholderInput:
        'For example: "I want to find a job, improve my English and start a project, but everything is mixed..."',
      timeIsUpTitle: "Time is up",
      timeIsUpDesc: "Close the task or restart 10 minutes.",
    },
  },
  ru: {
    translation: {
      appTitle: "Focus Plan",
      subtitle: "Одна мысль → один план действий",
      leftCardTitle: "Что у тебя в голове прямо сейчас?",
      leftCardDescription:
        "Опиши хаос текстом. Мы превратим в чёткий план на 3–5 шагов.",
      freeLeft: "бесплатно",
      generate: "Сгенерировать план",
      tipLeft: "Совет: чем честнее и проще текст, тем лучше план.",
      fast: "Быстро",
      deep: "Глубоко",
      strict: "Строго",
      soft: "Мягко",
      timeEstimates: "Оценка времени",
      regenerate: "Сгенерировать заново",
      save: "Сохранить",
      upgrade: "Обновление",
      upgradeDescription:
        "Оплата будет доступна в ближайшее время. Вы используете бесплатный тариф (3 попытки в день).",
      clear: "Очистить",
      placeholderInput:
        'Например: "Хочу найти работу, подтянуть английский и начать свой проект, но всё смешалось..."',
      timeIsUpTitle: "Время вышло",
      timeIsUpDesc: "Закрой задачу или перезапусти 10 минут.",
    },
  },
  uk: {
    translation: {
      appTitle: "Focus Plan",
      subtitle: "Одна думка → один план дій",
      leftCardTitle: "Що в тебе в голові просто зараз?",
      leftCardDescription:
        "Опиши хаос словами. Ми перетворимо його на чіткий план із 3–5 кроків.",
      freeLeft: "безк.",
      generate: "Згенерувати план",
      fast: "Швидко",
      deep: "Глибоко",
      strict: "Строго",
      soft: "Мʼяко",
      timeEstimates: "Оцінка часу",
      tipLeft: "Порада: чим чесніший і простіший текст, тим кращий план.",
      regenerate: "Згенерувати знову",
      save: "Зберегти",
      upgrade: "Оновлення",
      upgradeDescription:
        "Оплата буде доступна найближчим часом. Ви користуєтеся безкоштовним планом (3 спроби на день)",
      clear: "Очистити",
      placeholderInput:
        'Наприклад: "Хочу знайти роботу, підтягнути англійську і почати свій проєкт, але все змішалося..."',
      timeIsUpTitle: "Час вийшов",
      timeIsUpDesc: "Закрий задачу або перезапусти 10 хвилин.",
    },
  },
} as const;

const detectInitialLanguage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && ["en", "ru", "uk"].includes(saved)) return saved;

  // optional: detect browser language
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("uk")) return "uk";
  if (nav.startsWith("ru")) return "ru";
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
