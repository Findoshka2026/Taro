---
name: test-web-preview
description: How to test the Taro app end-to-end via the Expo web preview, including how to verify the AI proxy round-trip and a known web-only CORS gotcha.
---

# Testing Taro via the Expo web preview

## Why web preview

The shipping target is an Android APK, but the Expo web preview is the fastest way to exercise the full app logic in this environment without an Android emulator. The same React/RN code runs in the browser; UI is fully interactive.

Note: web is NOT a supported deliverable. Two RN dependencies that the web target needs (`react-native-web`, `react-dom`, `@expo/metro-runtime`, `babel-preset-expo`, `react-native-worklets`) may already be installed in `node_modules` from a prior session but are not in `package.json`. Don't add them as a permanent dep just for testing.

## Run

```bash
cd /home/ubuntu/repos/Taro
nohup npx expo start --web --port 8081 > /tmp/expo.log 2>&1 < /dev/null &
disown
# wait ~25s for Metro bundler to come up
curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:8081/
```

Open `http://localhost:8081/` in Chrome (the GUI Chrome is already running on this VM). The app loads with three covered tarot cards.

Maximize the window before recording: `wmctrl -r "Карта дня" -b add,maximized_vert,maximized_horz` (after `sudo apt-get install -y wmctrl` if not present).

## Reset state

The app persists state in `localStorage['tarot-daily:v1']`. To get back to the idle daily-draw state, run in browser console:
```js
localStorage.clear(); location.reload();
```

## AI flow (the main feature now)

1. The AI button (`AI-задача` / `AI task`) is only visible in the **idle** state (before tapping a card). After a card is drawn, layout switches to `ActiveView` which doesn't show it. Always reset state before testing AI.
2. Tap the AI button → app calls `https://taro-proxy.findoshka2k26.workers.dev/v1/chat/completions` with `X-App-Token` header (token hardcoded in `src/services/groq.ts`).
3. On success, `applyOverride` writes the AI task into `today.override` and `HomeScreen` re-renders with the new title/description/quote/cardArtId.
4. To capture network requests in console, install a fetch interceptor BEFORE tapping the button:
```js
window.__proxyCalls = [];
const orig = window.fetch;
window.fetch = async function(...args) {
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
  if (url && url.includes('taro-proxy')) {
    const e = { url, method: args[1]?.method, status: null };
    window.__proxyCalls.push(e);
    try { const r = await orig.apply(this, args); e.status = r.status; return r; } catch (err) { e.error = String(err); throw err; }
  }
  return orig.apply(this, args);
};
```
Then `JSON.stringify(window.__proxyCalls)` to inspect.

## Web-only CORS gotcha

The Cloudflare Worker MUST include CORS headers (`Access-Control-Allow-Origin: *`, OPTIONS preflight handler) for the web preview to call it from `localhost:8081`. Without those, the browser blocks the request with `TypeError: Failed to fetch` even though the proxy itself is healthy.

This only affects browser testing. React Native networking on Android does not issue CORS preflight, so the APK works regardless. The CORS headers are now in `proxy/worker.js`.

## Direct proxy smoke test (no browser)

```bash
curl -sf -X POST "https://taro-proxy.findoshka2k26.workers.dev/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-App-Token: <APP_TOKEN_FROM_src/services/groq.ts>" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"reply: pong"}],"max_tokens":5}'
```
Expect HTTP 200 with a Groq chat-completion JSON. The `X-App-Token` value lives in `src/services/groq.ts` (constant `APP_TOKEN`); do NOT paste it into chat — it gives anyone who has it the ability to drive Groq calls against the user's quota.

## Worker deploy

From `proxy/`: `npx --yes wrangler@latest deploy` (uses `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` env vars). Secrets `GROQ_API_KEY` and `APP_SHARED_SECRET` are managed via `wrangler secret put <NAME>` and are NOT in the repo or env config.

## What NOT to test in web

- Native haptics (`expo-haptics`) — silently no-ops on web
- Exact font kerning — different font renderer
- The `applyOverride` → ActiveView swap is fine to test on web; that's pure JS state.
