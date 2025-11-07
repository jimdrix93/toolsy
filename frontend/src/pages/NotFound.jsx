import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useI18n } from "../i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <>
      <SEO title={t("notfound.title")} description={t("notfound.description")} path="/404" />
      <div className="grid place-items-center py-20 text-center">
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-bold text-[color:var(--brand)]">{t("notfound.title")}</h1>
          <p className="muted">{t("notfound.subtitle")}</p>
          <div className="flex items-center justify-center gap-2">
            <Link to="/" className="btn-primary">{t("notfound.go_home")}</Link>
            <a href="https://github.com/jimdrix93/toolsy/issues" className="btn-outline">{t("notfound.report_issue")}</a>
          </div>
        </div>
      </div>
    </>
  );
}

