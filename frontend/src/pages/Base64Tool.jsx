import { useState } from "react";
import SEO from "../components/SEO";
import { track } from "../lib/analytics";
import { useToast } from "../components/Toast";
import { useI18n } from "../i18n";

export default function Base64Tool() {
  const { t } = useI18n();
  const { show } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [error, setError] = useState("");

  const handleConvert = () => {
    track("base64_convert", { mode });
    try {
      let result = "";
      if (mode === "encode") {
        result = btoa(unescape(encodeURIComponent(input)));
      } else {
        result = decodeURIComponent(escape(atob(input)));
      }
      setOutput(result);
      setError("");
      show(t("common.converted", { mode }));
    } catch (e) {
      setError(t("base64.invalid_msg"));
      setOutput("");
      show(t("common.invalid_input"), { variant: "error" });
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
        title={t("base64.title")}
        description={t("base64.description")}
        path="/base64"
      />
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand-auto">{t("base64.title")}</h1>
          <p className="muted">
            {t("base64.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="encode"
              checked={mode === "encode"}
              onChange={() => setMode("encode")}
            />
            {t("base64.encode")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="decode"
              checked={mode === "decode"}
              onChange={() => setMode("decode")}
            />
            {t("base64.decode")}
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleConvert}
              className="btn-primary"
            >
              {t("base64.convert")}
            </button>
            <button onClick={clearAll} className="btn-outline">
              {t("common.clear")}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="input" className="text-sm font-medium">
            {t("base64.input_label")}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Plain text..." : "Base64 string..."}
            className="textarea focus:ring-brand/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="output" className="text-sm font-medium">
            {t("base64.output_label")}
          </label>
          <textarea
            id="output"
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
          </div>
        </div>

        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <aside className="card p-3 text-sm muted">
          <p className="mb-1 font-medium">{t("common.tips")}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t("base64.tips_1")}</li>
            <li>{t("base64.tips_2")}</li>
            <li>{t("base64.tips_3")}</li>
          </ul>
        </aside>
      </div>
    </>
  );
}

