import SEO from "../components/SEO";
import { useI18n } from "../i18n";

export default function Privacy() {
  const { t } = useI18n();
  return (
    <>
      <SEO
        title={t("privacy.title")}
        description={t("privacy.description")}
        path="/privacy"
      />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[color:var(--brand)]">{t("privacy.title")}</h1>
        <p className="muted">
          {t("privacy.subtitle")}
        </p>
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold">{t("privacy.processing")}</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{t("privacy.processing_li1")}</li>
            <li>{t("privacy.processing_li2")}</li>
            <li>{t("privacy.processing_li3")}</li>
          </ul>
        </div>
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold">{t("privacy.analytics")}</h2>
          <p className="text-sm">
            {t("privacy.analytics_p")}
          </p>
        </div>
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold">{t("privacy.contact")}</h2>
          <p className="text-sm">
            {t("privacy.contact_p_prefix")} <a className="underline" href="https://github.com/jimdrix93/toolsy" target="_blank" rel="noreferrer">{t("privacy.github")}</a>.
          </p>
        </div>
      </div>
    </>
  );
}

