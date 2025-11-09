import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo-dark.png";
import { useI18n } from "../i18n";
import InstallButton from "../pwa/InstallButton";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-2 py-1 text-lg transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 ${
        isActive
          ? "text-brand-auto font-semibold underline underline-offset-4"
          : "text-neutral-700 hover:text-brand-auto dark:text-neutral-300 dark:hover:text-brand-auto"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Layout() {
  const { t, lang, setLang } = useI18n();
  const [dark, setDark] = useState(false);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial =
      saved === "dark"
        ? true
        : saved === "light"
        ? false
        : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(!!initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur dark:bg-[#111615]/90 dark:border-neutral-700">
        <div className="container-site flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoLight} alt="Toolsy logo" className="h-10 w-10 block dark:hidden" />
            <img src={logoDark} alt="Toolsy logo dark" className="h-10 w-10 hidden dark:block" />
            <span className="text-2xl font-bold text-brand-auto">Toolsy</span>
          </Link>
          <nav className="flex items-center gap-3">
            <NavItem to="/json-formatter">{t("nav.json")}</NavItem>
            <NavItem to="/base64">{t("nav.base64")}</NavItem>
            <NavItem to="/csv-json">{t("nav.csvjson")}</NavItem>
            <NavItem to="/hash">{t("nav.hash")}</NavItem>
            <NavItem to="/uuid">{t("nav.uuid")}</NavItem>
            <NavItem to="/about">{t("nav.about")}</NavItem>

            <select
              aria-label={t("nav.language")}
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="ml-2 rounded-lg px-2 py-2 text-sm border border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-600 dark:bg-[#141c17] dark:hover:bg-[#172019]"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>

            <button
              onClick={() => applyTheme(!dark)}
              aria-pressed={dark}
              className="ml-2 rounded-lg px-3 py-2 text-sm border border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-600 dark:bg-[#141c17] dark:hover:bg-[#172019]"
              aria-label={t("nav.toggle_dark")}
              title={dark ? t("nav.title_light") : t("nav.title_dark")}
            >
              <span aria-hidden>{dark ? "🌙" : "☀️"}</span>
            </button>

            <InstallButton />
          </nav>
        </div>
      </header>

      <main className="flex-1 container-site py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white dark:bg-[#0f1712] dark:border-neutral-700">
        <div className="container-site flex items-center justify-between py-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p className="text-brand-auto">© {new Date().getFullYear()} Toolsy</p>
          <a
            href="https://github.com/jimdrix93/toolsy"
            className="hover:text-neutral-800 dark:hover:text-neutral-200 text-[#084003] dark:text-[#54d171]"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
