import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import Share from "../components/Share";
import { useI18n } from "../i18n";
import { track } from "../lib/analytics";

function genUuid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  // Fallback: RFC4122 v4-like
  const s = [];
  const hex = "0123456789abcdef";
  for (let i = 0; i < 36; i++) s[i] = hex[Math.floor(Math.random() * 16)];
  s[14] = "4";
  s[19] = hex[(parseInt(s[19], 16) & 0x3) | 0x8];
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

export default function Uuid() {
  const { t, lang } = useI18n();
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [output, setOutput] = useState("");

  const transform = useMemo(() => (val) => {
    let v = val;
    if (!hyphens) v = v.replace(/-/g, "");
    if (uppercase) v = v.toUpperCase();
    return v;
  }, [uppercase, hyphens]);

  const generate = () => {
    const n = Math.min(1000, Math.max(1, Number(count) || 1));
    const list = Array.from({ length: n }, () => transform(genUuid()))
      .join("\n");
    setOutput(list);
    track("uuid_generate", { count: n });
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    // feedback via toast is already common, but keep silent here
  };

  const clear = () => setOutput("");

  const suffix = count === 1 ? "" : "s";

  return (
    <>
      <SEO
        title={lang.startsWith('es') ? 'Generador de UUID v4 Online – Toolsy' : 'Generate UUID v4 Online – Toolsy'}
        description={lang.startsWith('es') ? 'Genera UUID v4 online. Crea uno o varios UUID, en mayúsculas o sin guiones. 100% en tu navegador.' : 'Generate UUID v4 online. Create one or many UUIDs, uppercase or no hyphens. 100% client-side.'}
        path="/uuid"
        image="https://toolsykit.vercel.app/og-uuid.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": lang.startsWith('es') ? 'Inicio' : 'Home', "item": "https://toolsykit.vercel.app/" },
                { "@type": "ListItem", "position": 2, "name": lang.startsWith('es') ? 'Generador de UUID' : 'UUID Generator', "item": "https://toolsykit.vercel.app/uuid" }
              ]
            },
            {
              "@type": "SoftwareApplication",
              "name": lang.startsWith('es') ? 'Generador de UUID' : 'UUID Generator',
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": lang.startsWith('es') ? '¿Son suficientemente únicos estos UUID?' : 'Are these UUIDs unique enough?', "acceptedAnswer": { "@type": "Answer", "text": lang.startsWith('es') ? 'UUID v4 usa 122 bits de aleatoriedad; las colisiones son extremadamente improbables.' : 'UUID v4 uses 122 bits of randomness; collisions are astronomically unlikely.' } },
                { "@type": "Question", "name": lang.startsWith('es') ? '¿Puedo generarlos sin guiones o en mayúsculas?' : 'Can I generate them without hyphens or in uppercase?', "acceptedAnswer": { "@type": "Answer", "text": lang.startsWith('es') ? 'Sí. Activa las opciones para quitar guiones y/o convertir a mayúsculas.' : 'Yes. Toggle the options to remove hyphens and/or convert to uppercase.' } }
              ]
            }
          ]
        }}
      />
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand-auto">{t("uuid.title")}</h1>
          <p className="muted">{t("uuid.subtitle")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span>{t("uuid.count")}</span>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(e.target.valueAsNumber || 1)}
              className="input h-9 w-24 px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            {t("uuid.uppercase")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} />
            {t("uuid.with_hyphens")}
          </label>

          <div className="flex flex-wrap gap-2">
            <button onClick={generate} className="btn-primary">{t("uuid.generate")}</button>
            <button onClick={clear} className="btn-ghost">{t("common.clear")}</button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="output" className="label">{t("common.output")}</label>
          <textarea
            id="output"
            readOnly
            value={output}
            placeholder={t("uuid.placeholder")}
            className="textarea"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={copy} disabled={!output} className={`btn-outline ${!output ? "btn-disabled" : ""}`}>
              {t("common.copy_result")}
            </button>
          </div>
        </div>
        <Share titleKey="uuid.title" path="/uuid" />
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold">{lang.startsWith('es') ? '¿Qué es un UUID v4?' : 'What is a UUID v4?'}</h2>
          <p className="text-sm muted">
            {lang.startsWith('es')
              ? 'Un UUID (Identificador Único Universal) v4 es un identificador aleatorio de 128 bits usado para referenciar objetos de forma única. Este generador usa la Web Crypto API para aleatoriedad de alta calidad.'
              : 'A UUID (Universally Unique Identifier) v4 is a 128‑bit random identifier often used to uniquely reference objects. This generator uses the Web Crypto API for high‑quality randomness.'}
          </p>
          <p className="text-sm">
            {lang.startsWith('es') ? 'Ver también: ' : 'See also: '}
            <a className="underline" href="/hash">{lang.startsWith('es') ? 'Herramienta de Hash' : 'Hash Tool'}</a>
            {' '}
            {lang.startsWith('es') ? 'y ' : 'and '}
            <a className="underline" href="/json-formatter">{lang.startsWith('es') ? 'Formateador JSON' : 'JSON Formatter'}</a>.
          </p>
        </section>
      </div>
    </>
  );
}
