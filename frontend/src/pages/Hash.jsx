import { useState } from "react";
import SEO from "../components/SEO";
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
  const { t } = useI18n();
  const { show } = useToast();
  const [algo] = useState("SHA-256");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleHash = async () => {
    try {
      setError("");
      if (!input) { setOutput(""); return; }
      let hex = "";
      if (algo === "SHA-256") {
        hex = await sha256Hex(input);
      }
      setOutput(hex);
      track("hash_compute", { algo });
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
        title={t("hash.title")}
        description={t("hash.description")}
        path="/hash"
      />
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand-auto">{t("hash.title")}</h1>
          <p className="muted">{t("hash.subtitle")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="algo" className="label">{t("hash.algo_label")}</label>
            <select id="algo" className="input h-9 w-auto px-2 py-1" value={algo} readOnly>
              <option value="SHA-256">{t("hash.sha256")}</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleHash} className="btn-primary">{t("hash.hash")}</button>
            <button onClick={clearAll} className="btn-ghost">{t("common.clear")}</button>
          </div>
        </div>

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
      </div>
    </>
  );
}

