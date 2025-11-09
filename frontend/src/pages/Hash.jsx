import { useRef, useState } from "react";
import SEO from "../components/SEO";
import Share from "../components/Share";
import { useI18n } from "../i18n";
import { useToast } from "../components/Toast";
import { track } from "../lib/analytics";

async function sha256Hex(message) {
  const enc = new TextEncoder();
  const data = enc.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hashBuffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Hash() {
  const { t, lang } = useI18n();
  const { show } = useToast();
  const [algo, setAlgo] = useState("SHA-256");
  const [mode, setMode] = useState("text"); // 'text' | 'file'
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleHash = async () => {
    try {
      setError("");
      let hex = "";
      let data;
      if (mode === "text") {
        if (!input) { setOutput(""); return; }
        data = new TextEncoder().encode(input);
      } else {
        if (!file) { setOutput(""); return; }
        const buf = await file.arrayBuffer();
        data = new Uint8Array(buf);
      }
      const algoName = algo; // "SHA-1" | "SHA-256" | "SHA-512"
      const hashBuffer = await crypto.subtle.digest(algoName, data);
      const bytes = new Uint8Array(hashBuffer);
      hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
      setOutput(hex);
      track("hash_compute", { algo, mode, size: mode === 'file' ? file?.size : undefined });
      show(t("hash.hashed", { algo }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    show(t("common.copied"));
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    show(t("common.cleared"));
  };

  return (
    <>
      <SEO
        title={lang.startsWith('es') ? 'Herramienta de Hash (SHA-256, SHA-1, SHA-512) – Toolsy' : 'Hash Tool (SHA-256, SHA-1, SHA-512) – Toolsy'}
        description={lang.startsWith('es') ? 'Calcula SHA-256, SHA-1, SHA-384 y SHA-512 online para texto o archivos. 100% en tu navegador.' : 'Compute SHA-256, SHA-1, SHA-384 and SHA-512 online for text or files. 100% client-side.'}
        path="/hash"
        image="https://toolsykit.vercel.app/og-hash.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": lang.startsWith('es') ? 'Inicio' : 'Home', "item": "https://toolsykit.vercel.app/" },
                { "@type": "ListItem", "position": 2, "name": lang.startsWith('es') ? 'Herramienta de Hash' : 'Hash Tool', "item": "https://toolsykit.vercel.app/hash" }
              ]
            },
            {
              "@type": "SoftwareApplication",
              "name": lang.startsWith('es') ? 'Herramienta de Hash' : 'Hash Tool',
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": lang.startsWith('es') ? '¿Qué algoritmos están soportados?' : 'Which algorithms are supported?', "acceptedAnswer": { "@type": "Answer", "text": lang.startsWith('es') ? 'SHA-1, SHA-256, SHA-384 y SHA-512 tanto para texto como para archivos.' : 'SHA-1, SHA-256, SHA-384 and SHA-512 for both text and files.' } },
                { "@type": "Question", "name": lang.startsWith('es') ? '¿Funciona sin conexión?' : 'Does it work offline?', "acceptedAnswer": { "@type": "Answer", "text": lang.startsWith('es') ? 'Sí. Como PWA, una vez en caché puede funcionar offline.' : 'Yes. As a PWA, once cached it can run offline for repeated use.' } }
              ]
            }
          ]
        }}
      />
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand-auto">{t("hash.title")}</h1>
          <p className="muted">{t("hash.subtitle")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="algo" className="label">{t("hash.algo_label")}</label>
            <select id="algo" className="input h-9 w-auto px-2 py-1" value={algo} onChange={(e)=>setAlgo(e.target.value)}>
              <option value="SHA-1">{t("hash.sha1")}</option>
              <option value="SHA-256">{t("hash.sha256")}</option>
              <option value="SHA-384">{t("hash.sha384")}</option>
              <option value="SHA-512">{t("hash.sha512")}</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="label">{t("hash.mode_label")}</span>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name="mode" value="text" checked={mode === 'text'} onChange={()=>setMode('text')} />
              {t("hash.mode_text")}
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name="mode" value="file" checked={mode === 'file'} onChange={()=>setMode('file')} />
              {t("hash.mode_file")}
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleHash} className="btn-primary">{t("hash.hash")}</button>
            <button onClick={clearAll} className="btn-ghost">{t("common.clear")}</button>
          </div>
        </div>

        {mode === 'text' ? (
          <div className="space-y-2">
            <label htmlFor="input" className="label">{t("hash.input_label")}</label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hello world"
              className="textarea"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="file" className="label">{t("hash.file_label")}</label>
            <input
              ref={fileInputRef}
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="hidden"
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault(); setDragOver(false);
                const f = e.dataTransfer.files && e.dataTransfer.files[0];
                if (f) setFile(f);
              }}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer select-none ${dragOver ? 'border-[color:var(--brand)] bg-brand/5' : 'border-neutral-300 dark:border-neutral-700'}`}
            >
              <p className="text-sm">{t("hash.drop_hint")}</p>
              <p className="muted text-xs mt-1">{file ? `${file.name} (${file.size} bytes)` : t("hash.no_file")}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="output" className="label">{t("hash.output_label")}</label>
          <textarea
            id="output"
            readOnly
            value={output}
            placeholder={t("common.result_placeholder")}
            className="textarea"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={copyOutput} disabled={!output} className={`btn-outline ${!output ? "btn-disabled" : ""}`}>
              {t("common.copy_result")}
            </button>
          </div>
          {error && (
            <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{t("common.error")} {error}</div>
          )}
        </div>
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold">{lang.startsWith('es') ? '¿Qué es un hash criptográfico?' : 'What is a cryptographic hash?'}</h2>
          <p className="text-sm muted">
            {lang.startsWith('es')
              ? 'Un hash criptográfico (p. ej. SHA‑256) convierte datos en una huella de longitud fija, determinista y con evidencia de alteración. Esta herramienta calcula hashes localmente con la Web Crypto API.'
              : 'A cryptographic hash (e.g. SHA‑256) transforms data into a fixed‑length fingerprint that is deterministic and tamper‑evident. This tool computes hashes locally via the Web Crypto API.'}
          </p>
          <p className="text-sm">
            {lang.startsWith('es') ? 'Ver también: ' : 'See also: '}
            <a className="underline" href="/json-formatter">{lang.startsWith('es') ? 'Formateador JSON' : 'JSON Formatter'}</a>
            {' '}
            {lang.startsWith('es') ? 'y ' : 'and '}
            <a className="underline" href="/uuid">{lang.startsWith('es') ? 'Generador de UUID' : 'UUID Generator'}</a>.
          </p>
        </section>
        <Share titleKey="hash.title" path="/hash" />
      </div>
    </>
  );
}
