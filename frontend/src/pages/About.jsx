import SEO from "../components/SEO";
import { useI18n } from "../i18n";

export default function About() {
  const { t } = useI18n();
  return (
    <>
      <SEO title={t("about.title")} description={t("about.description")} path="/about" />
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">{t("about.title")}</h1>
        <p>{t("about.body_1")}</p>
      </div>
    </>
  );
}

