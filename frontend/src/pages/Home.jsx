import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useI18n } from "../i18n";

export default function Home() {
  const { t } = useI18n();
  const tools = [
    { path: "/json-formatter", title: t("home.tools.json_formatter.title"), desc: t("home.tools.json_formatter.desc") },
    { path: "/base64", title: t("home.tools.base64.title"), desc: t("home.tools.base64.desc") },
    { path: "/csv-json", title: t("home.tools.csvjson.title"), desc: t("home.tools.csvjson.desc") },
    { path: "/uuid", title: t("home.tools.uuid.title"), desc: t("home.tools.uuid.desc") }
  ];

  return (
    <>
      <SEO
        title={t("home.seo_title")}
        description={t("home.seo_description")}
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Toolsy",
          "url": "https://toolsykit.vercel.app",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://toolsykit.vercel.app/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-brand-auto">Toolsy</h1>
        <p className="muted">{t("home.subtitle")}</p>

        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((item) => (
            <Link key={item.path} to={item.path} className="card card-hover block p-4">
              <h2 className="font-semibold"> {item.title} </h2>
              <p className="muted mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
