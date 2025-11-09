import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { track } from "../lib/analytics";

export default function InstallButton() {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      track("pwa_install_prompt", {});
    };
    window.addEventListener("beforeinstallprompt", handler);
    // detect if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) setCanInstall(false);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice?.outcome === "accepted") track("pwa_install_accept", {});
    else track("pwa_install_dismiss", {});
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  if (!canInstall) return null;
  return (
    <button onClick={onInstall} className="ml-2 rounded-lg px-3 py-2 text-sm border border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-600 dark:bg-[#141c17] dark:hover:bg-[#172019]">
      {t("install.install_app")}
    </button>
  );
}

