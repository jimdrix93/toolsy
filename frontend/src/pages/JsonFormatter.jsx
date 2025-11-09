import { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO";
import Share from "../components/Share";
import { track } from "../lib/analytics";
import { useToast } from "../components/Toast";
import { useI18n } from "../i18n";
import { Link } from "react-router-dom";

function sortObjectKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortObjectKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, k) => {
        acc[k] = sortObjectKeysDeep(value[k]);
        return acc;
      }, {});
  }
  return value;
}

export default function JsonFormatter() {
  const { t, lang } = useI18n();
  const { show } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const formatJson = () => {
    track("json_format", { sortKeys, indent });
    setError("");
    try {
      const obj = JSON.parse(input);
      const processed = sortKeys ? sortObjectKeysDeep(obj) : obj;
      const pretty = JSON.stringify(processed, null, indent);
      setOutput(pretty);
      show(t("json.formatted"));
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : t("common.invalid_json"));
      show(t("common.invalid_json"), { variant: "error" });
    }
  };

  const minifyJson = () => {
    track("json_minify", {});
    setError("");
    try {
      const obj = JSON.parse(input);
      const processed = sortKeys ? sortObjectKeysDeep(obj) : obj;
      const minified = JSON.stringify(processed);
      setOutput(minified);
      show(t("json.minified"));
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : t("common.invalid_json"));
      show(t("common.invalid_json"), { variant: "error" });
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    show(t("common.copied"));
  };

  const pasteToInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text);
      if (text) show(t("common.paste_clipboard"), { variant: "info" });
    } catch {
      show("Clipboard not available", { variant: "error" });
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output + "\n"], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t("json.download_filename");
    a.click();
    URL.revokeObjectURL(url);
    show(t("common.download_started"));
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    show(t("common.cleared"));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key === "Enter") {
        e.preventDefault();
        formatJson();
      }
      if (isMeta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        minifyJson();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, indent, sortKeys]);

  const isApple = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || "");
  const metaLabel = isApple ? "⌘" : "Ctrl";

  return (
    <>
      <SEO
        title={lang.startsWith('es') ? "Formateador JSON Online – Toolsy" : "JSON Formatter Online – Toolsy"}
        description={lang.startsWith('es') ? "Formatea y valida JSON online. Embellece, minifica, ordena claves, copia y descarga. 100% en tu navegador." : "JSON formatter and validator online. Beautify, minify, sort keys, copy and download. 100% client-side."}
        path="/json-formatter"
        image="https://toolsykit.vercel.app/og-json.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": lang.startsWith('es') ? "Inicio" : "Home", "item": "https://toolsykit.vercel.app/" },
                { "@type": "ListItem", "position": 2, "name": lang.startsWith('es') ? "Formateador JSON" : "JSON Formatter", "item": "https://toolsykit.vercel.app/json-formatter" }
              ]
            },
            {
              "@type": "SoftwareApplication",
              "name": lang.startsWith('es') ? "Formateador JSON" : "JSON Formatter",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": lang.startsWith('es') ? "¿Se sube mi JSON a un servidor?" : "Is my JSON uploaded to a server?", "acceptedAnswer": { "@type": "Answer", "text": lang.startsWith('es') ? "No. Todo se ejecuta localmente en tu navegador (lado del cliente)." : "No. Everything runs locally in your browser (client-side)." } },
                { "@type": "Question", "name": lang.startsWith('es') ? "¿Puedo minificar JSON para producción?" : "Can I minify JSON for production?", "acceptedAnswer": { "@type": "Answer", "text": lang.startsWith('es') ? "Sí. Usa Minificar para quitar espacios y obtener una cadena compacta." : "Yes. Use the Minify action to remove whitespace and get a compact string." } }
              ]
            }
          ]
        }}
      />
      <div className="relative z-0 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand-auto">{t("json.title")}</h1>
          <p className="muted">
            {t("json.subtitle", { meta: metaLabel })}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="indent" className="label">
              {t("json.indent")}
            </label>
            <select
              id="indent"
              className="input h-9 w-auto px-2 py-1"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
            >
              <option value={2}>{t("json.indent_2")}</option>
              <option value={4}>{t("json.indent_4")}</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
            />
            {t("json.sort_keys")}
          </label>

          <div className="flex flex-wrap gap-2">
            <button onClick={formatJson} className="btn-primary">
              {t("common.format")}
            </button>
            <button onClick={minifyJson} className="btn-outline">
              {t("common.minify")}
            </button>
            <button onClick={clearAll} className="btn-ghost">
              {t("common.clear")}
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label htmlFor="input" className="label">
            {t("json.input_label")}
          </label>
          <textarea
            id="input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"Ada","age":27,"skills":["math","code"]}'
            className="textarea focus:ring-brand/30"
            aria-invalid={!!error}
            aria-describedby={error ? "json-error" : undefined}
          />
          <div className="flex gap-2">
            <button onClick={pasteToInput} className="btn-outline">
              {t("common.paste_clipboard")}
            </button>
          </div>
          {error && (
            <div
              id="json-error"
              role="alert"
              className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700"
            >
              {t("common.error")} {error}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <label htmlFor="output" className="label">
            {t("json.output_label")}
          </label>
          <textarea
            id="output"
            ref={outputRef}
            value={output}
            readOnly
            placeholder={t("common.result_placeholder")}
            className="textarea focus:ring-brand/30"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyOutput}
              className={`btn-outline ${!output ? "btn-disabled" : ""}`}
              disabled={!output}
            >
              {t("common.copy_result")}
            </button>
            <button
              onClick={downloadOutput}
              className={`btn-outline ${!output ? "btn-disabled" : ""}`}
              disabled={!output}
            >
              {t("common.download")} .json
            </button>
          </div>
        </div>

        <aside className="card p-3 text-sm muted">
          <p className="mb-1 font-medium">{t("common.tips")}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {t("json.advice_1", { meta: metaLabel })}
            </li>
            <li>
              {t("json.advice_2")}
            </li>
            <li>
              {t("json.advice_3")}
            </li>
          </ul>
        </aside>

        <section className="card p-4 space-y-2">
          <h2 className="font-semibold">
            {lang.startsWith('es') ? '¿Qué es un formateador JSON?' : 'What is a JSON formatter?'}
          </h2>
          <p className="text-sm muted">
            {lang.startsWith('es')
              ? 'Un formateador (o embellecedor) de JSON valida y hace legible el JSON: añade indentación y puede ordenar claves. Esta herramienta funciona 100% en tu navegador; tus datos no salen del dispositivo.'
              : 'A JSON formatter (or beautifier) validates and pretty‑prints JSON for readability. This tool runs entirely in your browser; your data never leaves your device.'}
          </p>
          <p className="text-sm">
            {lang.startsWith('es') ? 'Ver también: ' : 'See also: '}
            <Link className="underline" to="/uuid">{lang.startsWith('es') ? 'Generador de UUID' : 'UUID Generator'}</Link>
            {' '}
            {lang.startsWith('es') ? 'y ' : 'and '}
            <Link className="underline" to="/hash">{lang.startsWith('es') ? 'Herramienta de Hash' : 'Hash Tool'}</Link>.
          </p>
        </section>

        <Share titleKey="json.title" path="/json-formatter" />
      </div>
    </>
  );
}
