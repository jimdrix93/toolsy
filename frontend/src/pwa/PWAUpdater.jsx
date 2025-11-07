import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { useI18n } from "../i18n";

export default function PWAUpdater() {
  const { t } = useI18n();
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState(() => () => {});

  useEffect(() => {
    const update = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        // no-op; could show a toast if desired
      },
    });
    setUpdateSW(() => update);
  }, []);

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-[200]">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-lg border border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-100 p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">{t("pwa.update_available")}</span>
            <div className="flex gap-2">
              <button
                className="btn-primary px-3 py-1 text-sm"
                onClick={async () => {
                  setNeedRefresh(false);
                  await updateSW(true);
                }}
              >
                {t("pwa.reload")}
              </button>
              <button
                className="btn-ghost px-3 py-1 text-sm"
                onClick={() => setNeedRefresh(false)}
              >
                {t("pwa.dismiss")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

