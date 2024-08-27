import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/en-US.json";
import ko from "./ko/ko.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

const LANGUAGES = {
  // 코드에서 언어 변경 시 사용할 enum
  KO: "ko",
  EN: "en",
};

const resources = {
  //i18n 설정 초기화에 등록을 위한 object
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
};

i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector) // 언어 자동 감지
  .init({
    resources,
    debug: true,
    // lng: "ko",
    fallbackLng: LANGUAGES.EN, // 번역 파일에서 찾을 수 없는 경우 기본 설정 언어
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n, LANGUAGES };
