import { Helmet } from "@dr.pogodin/react-helmet";
import { useMemo } from "react";

const SITE_NAME = "Toolsy";
const DEFAULT_IMAGE = "/og-default.png";

export default function SEO({ title, description = "Small, fast, privacy-friendly online utilities.", path = "/", image = DEFAULT_IMAGE, jsonLd }) {
  const origin = useMemo(() => {
    const fromEnv = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) ? import.meta.env.VITE_SITE_URL : null;
    if (fromEnv) return fromEnv.replace(/\/$/, '');
    if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
    return "https://toolsykit.vercel.app";
  }, []);
  const url = useMemo(() => (path.startsWith("/") ? origin + path : origin + "/" + path), [path, origin]);
  const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
  const ogLocale = useMemo(() => {
    try {
      const lang = (typeof document !== 'undefined' ? document.documentElement.lang : 'en') || 'en';
      return lang.startsWith('es') ? 'es_ES' : 'en_US';
    } catch { return 'en_US'; }
  }, []);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="theme-color" content="#084003" />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {import.meta?.env?.VITE_TWITTER_HANDLE && (
        <meta name="twitter:site" content={import.meta.env.VITE_TWITTER_HANDLE} />
      )}
      {import.meta?.env?.VITE_TWITTER_HANDLE && (
        <meta name="twitter:creator" content={import.meta.env.VITE_TWITTER_HANDLE} />
      )}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
