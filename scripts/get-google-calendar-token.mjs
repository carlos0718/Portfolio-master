/**
 * One-time local helper to generate a permanent GOOGLE_REFRESH_TOKEN
 * for Carlos's Google Calendar (read availability + create interview events with Meet).
 *
 * Usage:
 *   1. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
 *   2. Run: npm run calendar:auth
 *   3. Sign in with cajs0718@gmail.com in the browser window that opens
 *   4. Paste the printed GOOGLE_REFRESH_TOKEN into .env and Vercel Environment Variables
 */

import http from 'node:http';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
const PORT = 42813;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nMissing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env');
  console.error('Create an OAuth 2.0 Client ID (Web application) in Google Cloud Console');
  console.error(`with Authorized redirect URI: ${REDIRECT_URI}\n`);
  process.exit(1);
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const parsed = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const code = parsed.searchParams.get('code');
  const error = parsed.searchParams.get('error');

  if (error || !code) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h2>Authorization failed: ${error || 'missing code'}</h2>`);
    server.close();
    process.exit(1);
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      }).toString()
    });

    const data = await tokenRes.json();
    if (!tokenRes.ok || !data.refresh_token) {
      throw new Error(data.error_description || JSON.stringify(data));
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      '<div style="font-family:sans-serif;padding:2rem"><h2>Google Calendar conectado correctamente</h2><p>Ya podés cerrar esta pestaña y volver a la terminal para copiar tu <code>GOOGLE_REFRESH_TOKEN</code>.</p></div>'
    );

    console.log('\n=== SUCCESS ===');
    console.log('Add this line to your .env and Vercel Environment Variables:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}\n`);
    server.close();
    process.exit(0);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Token exchange failed: ${err.message}`);
    console.error('Token exchange failed:', err.message);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('\nOpen this URL in your browser and sign in with cajs0718@gmail.com:\n');
  console.log(authUrl.toString());
  console.log(`\nWaiting for callback on ${REDIRECT_URI} ...\n`);
});
