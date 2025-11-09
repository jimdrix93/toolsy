// Simple IndexNow ping script
// Usage: node scripts/indexnow.mjs [origin]
// Example: node scripts/indexnow.mjs https://toolsykit.vercel.app

import https from 'https';
import { URL } from 'url';

const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const envOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const configuredOrigin = process.env.SITE_URL || process.env.VITE_SITE_URL || null;
const cliOrigin = process.argv[2] || null;
const FORCE = process.argv.includes('--force');

if (!isProd && !cliOrigin && !FORCE) {
  console.log('IndexNow: skipping (non-production environment). Use --force or pass an origin to override.');
  process.exit(0);
}

const ORIGIN = cliOrigin || configuredOrigin || (isProd ? 'https://toolsykit.vercel.app' : (envOrigin || 'https://toolsykit.vercel.app'));
const KEY = '8f4f4b4d8e2f4a8b8cd6c1e6f76c9c5a';
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;

const paths = ['/', '/json-formatter', '/base64', '/csv-json', '/hash', '/uuid'];

function ping(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL('https://api.indexnow.org/indexnow');
    u.searchParams.set('url', urlStr);
    u.searchParams.set('key', KEY);
    u.searchParams.set('keyLocation', KEY_LOCATION);
    https.get(u.toString(), (res) => {
      const { statusCode } = res;
      res.resume();
      if (statusCode && statusCode >= 200 && statusCode < 300) resolve(statusCode);
      else resolve(statusCode || 0);
    }).on('error', reject);
  });
}

(async () => {
  console.log(`IndexNow ping start for origin: ${ORIGIN}`);
  for (const p of paths) {
    const url = `${ORIGIN}${p}`.replace(/\/$/, p === '/' ? '/' : '');
    const code = await ping(url).catch(() => 0);
    console.log(`${url} -> ${code}`);
  }
  console.log('IndexNow ping completed');
})();
