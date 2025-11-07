import { useMemo, useState } from "react";
import SEO from "../components/SEO";
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
  const { t } = useI18n();
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
        title={t("uuid.title")}
        description={t("uuid.description")}
        path="/uuid"
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
      </div>
    </>
  );
}
