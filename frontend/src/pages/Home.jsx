import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useI18n } from "../i18n";

export default function Home() {
  const { t } = useI18n();
  const tools = [
    { path: "/json-formatter", title: t("home.tools.json_formatter.title"), desc: t("home.tools.json_formatter.desc") },
    { path: "/base64", title: t("home.tools.base64.title"), desc: t("home.tools.base64.desc") },
    { path: "/csv-json", title: t("home.tools.csvjson.title"), desc: t("home.tools.csvjson.desc") },
    { path: "/hash", title: t("home.tools.hash.title"), desc: t("home.tools.hash.desc") },
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
          "@graph": [
            {
              "@type": "WebSite",
              "name": "Toolsy",
              "url": "https://toolsykit.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://toolsykit.vercel.app/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "Organization",
              "name": "Toolsy",
              "url": "https://toolsykit.vercel.app",
              "logo": "https://toolsykit.vercel.app/logo-512.png"
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Is my data processed locally?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Toolsy processes everything locally in your browser (client-side)." } },
                { "@type": "Question", "name": "Does it work offline?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. As a PWA, you can install it and many tools work offline once cached." } },
                { "@type": "Question", "name": "Do you use tracking cookies?", "acceptedAnswer": { "@type": "Answer", "text": "No. We use privacy-friendly analytics without cookies and no personal data." } }
              ]
            }
          ]
        }}
      />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-brand-auto">Toolsy</h1>
        <p className="muted">{t("home.subtitle")}</p>
        <p className="muted text-sm">{t("home.brand_note")}</p>

        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((item) => (
            <Link key={item.path} to={item.path} className="card card-hover block p-4">
              <h2 className="font-semibold"> {item.title} </h2>
              <p className="muted mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
      <section className="mt-8 card p-4">
        <h2 className="font-semibold mb-2">FAQ</h2>
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-medium">¿Mis datos se suben a algún servidor? / Are my data uploaded?</p>
            <p className="muted">No. Todo se procesa localmente en tu navegador (client‑side). / No. Everything runs locally in your browser (client‑side).</p>
          </div>
          <div>
            <p className="font-medium">¿Funciona offline? / Does it work offline?</p>
            <p className="muted">Sí, como PWA puedes instalarla y muchas herramientas funcionan sin conexión tras la primera carga. / Yes, as a PWA you can install it and many tools work offline once cached.</p>
          </div>
          <div>
            <p className="font-medium">¿Usáis cookies de seguimiento? / Do you use tracking cookies?</p>
            <p className="muted">No. Usamos analítica respetuosa sin cookies ni datos personales. / No. We use privacy‑friendly analytics without cookies or personal data.</p>
          </div>
        </div>
      </section>
    </>
  );
}
