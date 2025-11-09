// Simple IndexNow ping script
// Usage: node scripts/indexnow.mjs [origin]
// Example: node scripts/indexnow.mjs https://toolsykit.vercel.app

import https from 'https';
import { URL } from 'url';

const ORIGIN = process.argv[2] || 'https://toolsykit.vercel.app';
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

