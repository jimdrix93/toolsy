import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./locales/en.json";
import es from "./locales/es.json";

const LOCALES = { en, es };

function resolve(obj, path) {
  if (!obj) return undefined;
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
      cur = cur[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(.*?)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const initial = useMemo(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved === "en" || saved === "es") return saved;
    const nav = typeof navigator !== "undefined" ? navigator.language || navigator.userLanguage : "en";
    return nav && nav.toLowerCase().startsWith("es") ? "es" : "en";
  }, []);

  const [lang, setLang] = useState(initial);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
    localStorage.setItem("lang", lang);
  }, [lang]);

  const dict = LOCALES[lang] || en;

  const t = useMemo(() => {
    return (key, vars) => {
      const val = resolve(dict, key);
      if (typeof val === "string") return interpolate(val, vars);
      // Fallback: return key if missing
      return key;
    };
  }, [dict]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
