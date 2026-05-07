# Taro Groq Proxy (Cloudflare Worker)

Tiny edge proxy that fronts the Groq API for the Taro mobile app. The Groq API
key is stored as a Worker secret and never ships in the app bundle or repo.

## Deployed instance

- URL: https://taro-proxy.findoshka2k26.workers.dev
- Endpoints:
  - `GET /healthz` — liveness probe
  - `POST /v1/chat/completions` — proxied Groq chat completion
- Auth: clients send `X-App-Token: <APP_SHARED_SECRET>`. Bad/missing token → 401.
- Model allow-list: `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`. Anything
  else → 400.
- Server caps `max_tokens` at 800.

## Secrets (set via `wrangler secret put …`)

| Name                | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `GROQ_API_KEY`      | Bearer token sent upstream to `api.groq.com`              |
| `APP_SHARED_SECRET` | Token clients must send via `X-App-Token` header to call  |

## Local development / re-deploy

```bash
cd proxy
npx wrangler@latest login        # first time only
npx wrangler@latest deploy       # ships worker.js to Cloudflare
npx wrangler@latest secret put GROQ_API_KEY
npx wrangler@latest secret put APP_SHARED_SECRET
```

The mobile client's matching token lives in `src/services/groq.ts` as
`APP_TOKEN`. If you rotate `APP_SHARED_SECRET`, update that constant and rebuild
the APK.

## Why this exists

Hardcoding the Groq key directly in a public repo / public APK fails because:

1. Groq's GitHub scanners auto-revoke keys matching `gsk_*` found in public
   repos within hours.
2. Even with a private repo, anyone can extract strings from the released APK.
3. A single compromised key drains the shared free-tier quota for every user.

The proxy moves the key to server-side state where it can be rotated without
shipping a new APK, and the per-IP/per-token boundary lets us cap abuse before
it costs anything.
