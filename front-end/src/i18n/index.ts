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
      copy: "Copy",
      placeholderInput:
        'For example: "I want to find a job, improve my English and start a project, but everything is mixed..."',
      timeIsUpTitle: "Time is up",
      timeIsUpDesc: "Close the task or restart 10 minutes.",
      rightCardTitle: "Your Focus Plan",
      rightCardDescription:
        "Clear steps. No philosophy. Straight to the point.",
      click: "Click",
      clickPhrase: "and the result will appear.",
      startButton: "Start 10 min",
      firstActionMin: "First action (10 minutes)",
      buttonDone: "I did it",
      toastTimeIsUpToast: "Time is up",
      toastTimeIsUpDesc: "Close the task or restart the 10 minute timer.",
      toastInvalidInput: "Invalid input",
      toastInvalidInputDesc: "Please add more details.",
      toastServerError: "Something went wrong",
      toastServerErrorDesc:
        "The server is temporarily unavailable. Please try again in a moment.",
      toastSuccessMessage: "Excellent!",
      toastSuccessMessageDesc: "First step completed.",
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
      copy: "Скопировать",
      upgradeDescription:
        "Оплата будет доступна в ближайшее время. Вы используете бесплатный тариф (3 попытки в день).",
      clear: "Очистить",
      placeholderInput:
        'Например: "Хочу найти работу, подтянуть английский и начать свой проект, но всё смешалось..."',
      timeIsUpTitle: "Время вышло",
      timeIsUpDesc: "Закрой задачу или перезапусти 10 минут.",
      rightCardTitle: "Твой План",
      rightCardDescription: "Чёткие шаги. Без философии. Сразу к делу.",
      click: "Нажми",
      clickPhrase: "— тут появится результат.",
      startButton: "Начать 10 мин.",
      firstActionMin: "Первое действие (10 минут)",
      buttonDone: "Сделано",
      toastTimeIsUpToast: "Время вышло",
      toastTimeIsUpDesc: "Закрой задачу или перезапусти таймер на 10 минут.",
      toastInvalidInput: "Некорректный ввод",
      toastInvalidInputDesc: "Добавьте больше деталей.",
      toastServerError: "Что-то пошло не так",
      toastServerErrorDesc:
        "Сервер временно недоступен. Пожалуйста, попробуйте позже",
      toastSuccessMessage: "Отлично!",
      toastSuccessMessageDesc: "Первое действие выполнено.",
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
      upgrade: "Оновити",
      copy: "Скопіювати",
      upgradeDescription:
        "Оплата буде доступна найближчим часом. Ви користуєтеся безкоштовним планом (3 спроби на день)",
      clear: "Очистити",
      placeholderInput:
        'Наприклад: "Хочу знайти роботу, підтягнути англійську і почати свій проєкт, але все змішалося..."',
      timeIsUpTitle: "Час вийшов",
      timeIsUpDesc: "Закрий задачу або перезапусти 10 хвилин.",
      rightCardTitle: "Твій План",
      rightCardDescription: "Чіткі кроки. Жодної філософії. Прямо до діла.",
      click: "Натисни",
      clickPhrase: "— тут зʼявиться результат",
      startButton: "Почати 10 хв.",
      firstActionMin: "Перша дія (10 хвилин)",
      buttonDone: "Зроблено",
      toastTimeIsUpToast: "Час вийшов",
      toastTimeIsUpDesc: "Закрий задачу або перезапусти таймер на 10 хвилин.",
      toastInvalidInput: "Некоректний ввід",
      toastInvalidInputDesc: "Додайте більше деталей.",
      toastServerError: "Щось пішло не так",
      toastServerErrorDesc:
        "Сервер тимчасово недоступний. Спробуйте ще раз за мить.",
      toastSuccessMessage: "Чудово!",
      toastSuccessMessageDesc: "Перша дія виконана.",
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
