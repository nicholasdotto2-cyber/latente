// Latente — Worker minimo per assessment (Fase 0)
//
// Endpoint:
//   POST /lead    { email, archetipo? }        -> 200 { ok:true } | 400
//   POST /ev      { ev, data? }  (sendBeacon)   -> 204
//   GET  /stats?key=SECRET                      -> 200 JSON | 401
//   GET  /                                      -> 200 "latente worker ok" (health check)
//
// Storage: Cloudflare KV (binding "DB"). Nessun D1, nessuna dipendenza.
//
// Chiavi KV:
//   lead:<ISO-timestamp>:<random>  = { email, archetipo, ts, ua }
//   ev:<ISO-timestamp>:<random>    = { ev, data, ts }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(env) {
  const allowOrigin = env.ALLOW_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(env),
    },
  });
}

function randomId() {
  // Sufficiente per evitare collisioni tra chiavi KV nello stesso millisecondo.
  return Math.random().toString(36).slice(2, 10);
}

// Body parsing tollerante: sendBeacon spesso manda Content-Type text/plain
// (o niente) anche quando il body e' una stringa JSON. Proviamo comunque
// il parse; se falliamo torniamo null (il chiamante decide cosa fare).
async function parseBodyTolerant(request) {
  const raw = await request.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_err) {
    return null;
  }
}

async function handleLead(request, env) {
  const data = await parseBodyTolerant(request);
  const email = data && typeof data.email === "string" ? data.email.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: "invalid_email" }, 400, env);
  }

  const archetipo =
    data && typeof data.archetipo === "string" && data.archetipo.length > 0
      ? data.archetipo
      : null;

  const ts = new Date().toISOString();
  const key = `lead:${ts}:${randomId()}`;
  const value = {
    email,
    archetipo,
    ts,
    ua: request.headers.get("user-agent") || null,
  };

  await env.DB.put(key, JSON.stringify(value));

  return jsonResponse({ ok: true }, 200, env);
}

async function handleEv(request, env) {
  const data = await parseBodyTolerant(request);
  const ev = data && typeof data.ev === "string" && data.ev.length > 0 ? data.ev : "unknown";
  const extra = data && data.data !== undefined ? data.data : null;

  const ts = new Date().toISOString();
  const key = `ev:${ts}:${randomId()}`;
  const value = { ev, data: extra, ts };

  await env.DB.put(key, JSON.stringify(value));

  // 204 senza body. sendBeacon non legge la risposta, ma rispondiamo comunque
  // in modo corretto e senza bisogno di preflight (niente Content-Type custom).
  return new Response(null, { status: 204, headers: corsHeaders(env) });
}

// Elenca TUTTE le chiavi con un dato prefix, paginando con cursor finche'
// list_complete non e' true. KV.list() torna al massimo 1000 chiavi a botta.
async function listAllKeys(env, prefix) {
  const keys = [];
  let cursor;
  for (;;) {
    const page = await env.DB.list({ prefix, cursor });
    keys.push(...page.keys);
    if (page.list_complete || !page.cursor) break;
    cursor = page.cursor;
  }
  return keys;
}

async function handleStats(request, env, url) {
  const key = url.searchParams.get("key");
  if (!key || key !== env.STATS_SECRET) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401, env);
  }

  const leadKeys = await listAllKeys(env, "lead:");
  const evKeys = await listAllKeys(env, "ev:");

  // Conteggio eventi per nome. NON conosciamo con certezza i nomi-evento
  // reali emessi dal client (vedi README): quindi qui contiamo tutti gli
  // `ev` per nome, generico, senza assumere quali siano "start" o "complete".
  const evCounts = {};
  for (const k of evKeys) {
    const raw = await env.DB.get(k.name);
    if (!raw) continue;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (_err) {
      continue;
    }
    const name = parsed && parsed.ev ? parsed.ev : "unknown";
    evCounts[name] = (evCounts[name] || 0) + 1;
  }

  const result = {
    ok: true,
    leads: leadKeys.length,
    events_total: evKeys.length,
    events_by_name: evCounts,
  };

  // Se tra i nomi-evento ci sono candidati ovvi di "avvio" e "completamento"
  // dell'assessment, calcoliamo anche le due percentuali go/no-go richieste
  // da IDEA.md. Match case-insensitive e tollerante su alcuni nomi plausibili;
  // NON e' garantito che siano quelli reali (vedi README per verifica).
  const startCandidates = ["assessment_start", "start", "quiz_start", "started"];
  const completeCandidates = ["assessment_complete", "complete", "completed", "quiz_complete", "finish", "finished"];
  const leadCandidates = ["lead_submit", "email_submit", "lead", "email_captured"];

  const findCount = (candidates) => {
    for (const name of Object.keys(evCounts)) {
      if (candidates.includes(name.toLowerCase())) {
        return evCounts[name];
      }
    }
    return null;
  };

  const startCount = findCount(startCandidates);
  const completeCount = findCount(completeCandidates);
  const leadEventCount = findCount(leadCandidates);

  if (startCount !== null && completeCount !== null && startCount > 0) {
    result.completion_rate_pct = Math.round((completeCount / startCount) * 1000) / 10;
  }
  if (completeCount !== null && completeCount > 0) {
    // % di email lasciate sui completanti: usiamo leads (fonte affidabile,
    // scritte da /lead) come numeratore.
    result.email_capture_rate_pct = Math.round((leadKeys.length / completeCount) * 1000) / 10;
  } else if (leadEventCount !== null) {
    result.note_email_capture =
      "Nessun evento di completamento riconosciuto: email_capture_rate_pct non calcolata automaticamente.";
  }

  if (result.completion_rate_pct === undefined || result.email_capture_rate_pct === undefined) {
    result.note =
      "Percentuali go/no-go non completamente calcolabili: nomi-evento reali non confermati. " +
      "Vedi events_by_name e README per indicare a Claude i nomi esatti emessi da track().";
  }

  return jsonResponse(result, 200, env);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (method === "GET" && pathname === "/") {
      return new Response("latente worker ok", {
        status: 200,
        headers: { "Content-Type": "text/plain", ...corsHeaders(env) },
      });
    }

    if (method === "POST" && pathname === "/lead") {
      return handleLead(request, env);
    }

    if (method === "POST" && pathname === "/ev") {
      return handleEv(request, env);
    }

    if (method === "GET" && pathname === "/stats") {
      return handleStats(request, env, url);
    }

    return jsonResponse({ ok: false, error: "not_found" }, 404, env);
  },
};
