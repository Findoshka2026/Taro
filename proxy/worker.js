/**
 * Taro Groq proxy — Cloudflare Worker.
 *
 * The Taro mobile app calls this Worker instead of calling Groq directly,
 * so the Groq API key never ships in the repo or APK. The Worker validates a
 * shared `X-App-Token` baked into the client and forwards the chat-completion
 * request to Groq with the secret key attached.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const ALLOWED_MODELS = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") {
      return jsonResponse({ status: "ok" });
    }

    if (
      url.pathname === "/v1/chat/completions" &&
      request.method === "POST"
    ) {
      if (!env.GROQ_API_KEY) {
        return jsonResponse({ error: "Proxy is not configured" }, 500);
      }
      if (
        env.APP_SHARED_SECRET &&
        request.headers.get("x-app-token") !== env.APP_SHARED_SECRET
      ) {
        return jsonResponse({ error: "Invalid or missing app token" }, 401);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON body" }, 400);
      }

      if (!ALLOWED_MODELS.has(body.model)) {
        return jsonResponse(
          { error: `Model '${body.model}' is not allowed` },
          400,
        );
      }

      body.max_tokens = Math.min(body.max_tokens || 400, 800);

      const upstream = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
