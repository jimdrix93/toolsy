import { useMemo } from "react";
import { useI18n } from "../i18n";

export default function Share({ titleKey, path }) {
  const { t } = useI18n();
  const url = useMemo(() => {
    if (typeof window !== "undefined") return window.location.origin + (path || window.location.pathname);
    return "https://toolsykit.vercel.app" + (path || "/");
  }, [path]);
  const text = t(titleKey);
  const slug = (path || "/").replace(/^\/+/, '').replace(/\/+$/, '') || 'home';
  const withUtm = (base, src) => `${base}${base.includes('?') ? '&' : '?'}utm_source=${src}&utm_medium=social&utm_campaign=share-tool&utm_content=${slug}`;
  const twitter = withUtm(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, 'twitter');
  const linkedin = withUtm(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 'linkedin');
  const reddit = withUtm(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, 'reddit');
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="muted">{t("share.share")}</span>
      <a className="btn-ghost" href={twitter} target="_blank" rel="noreferrer">{t("share.twitter")}</a>
      <a className="btn-ghost" href={linkedin} target="_blank" rel="noreferrer">{t("share.linkedin")}</a>
      <a className="btn-ghost" href={reddit} target="_blank" rel="noreferrer">{t("share.reddit")}</a>
    </div>
  );
}
