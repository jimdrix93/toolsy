import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n";
import { track } from "../lib/analytics";

export default function InstallButton() {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [openHint, setOpenHint] = useState(false);

  const isIOS = useMemo(() => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, []);
  const isStandalone = useMemo(() => (
    window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
  ) || (navigator).standalone, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      track("pwa_install_prompt", {});
    };
    window.addEventListener("beforeinstallprompt", handler);
    const onInstalled = () => {
      setInstalled(true);
      setCanInstall(false);
    };
    window.addEventListener('appinstalled', onInstalled);
    if (isStandalone) { setInstalled(true); setCanInstall(false); }
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
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

  const shouldShowButton = !installed && (canInstall || isIOS || true);

  if (!shouldShowButton) return null;
  return (
    <>
      <button
        onClick={() => {
          if (deferredPrompt) onInstall();
          else setOpenHint(true);
        }}
        className="ml-2 rounded-lg px-3 py-2 text-sm border border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-600 dark:bg-[#141c17] dark:hover:bg-[#172019]"
      >
        {t("install.install_app")}
      </button>
      {openHint && (
        <div className="fixed inset-0 z-[300] grid place-items-center bg-black/30" role="dialog" aria-modal="true">
          <div className="max-w-sm w-[92%] rounded-lg border bg-white p-4 shadow-lg dark:bg-[#121a15] dark:border-neutral-700">
            <div className="mb-2 font-semibold">{t("install.install_app")}</div>
            <p className="muted text-sm">
              {isIOS ? t("install.ios_tip") : t("install.use_menu")}
            </p>
            <div className="mt-3 text-right">
              <button className="btn-primary px-3 py-1 text-sm" onClick={() => setOpenHint(false)}>
                {t("install.got_it")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
