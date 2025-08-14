# CORS Issues During Development

## Problem

When developing locally, you'll encounter CORS (Cross-Origin Resource Sharing) errors when trying to fetch RSS feeds from external domains. This is because browsers block cross-origin requests by default.

## Solutions

### Option 1: Use a CORS Browser Extension (Recommended for Development)

Install a CORS browser extension to disable CORS checks during development:

**Chrome/Edge:**

- Install "CORS Unblock" or "Allow CORS: Access-Control-Allow-Origin"
- Enable the extension
- Refresh your page

**Firefox:**

- Install "CORS Everywhere" or similar
- Enable the extension
- Refresh your page

### Option 2: Use the Netlify Function (Production)

The app includes a Netlify function (`netlify/functions/rss-proxy.ts`) that fetches RSS feeds server-side, avoiding CORS entirely.

To use this in production:

1. Deploy to Netlify
2. The function will automatically handle RSS fetching
3. No CORS issues will occur

### Option 3: Development Server Proxy

The Vite config includes a proxy configuration for development, but you'll need to run the Netlify CLI locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start Netlify dev server
netlify dev

# In another terminal, start Vite
npm run dev
```

### Option 4: Use Reliable CORS Proxies

The app now uses more reliable CORS proxy services:

- `corsproxy.io` (most reliable)
- `thingproxy.freeboard.io`
- `api.codetabs.com`

## Current Status

- ✅ Netlify function created for production
- ✅ Reliable CORS proxies configured
- ✅ Fallback mechanisms in place
- ⚠️ CORS extension needed for local development

## Recommendation

For development: Use a CORS browser extension
For production: Deploy to Netlify (CORS issues resolved automatically)
