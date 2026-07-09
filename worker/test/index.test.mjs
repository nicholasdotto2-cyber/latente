// Test di logica per il Worker, SENZA deploy e senza wrangler.
// Mocka env.DB (KV) con una Map e usa le globali fetch/Request/Response di
// Node (>=18) per esercitare l'handler `fetch` esportato da ../src/index.js.
//
// Esegui: node test/index.test.mjs

import assert from "node:assert/strict";
import worker from "../src/index.js";

let failures = 0;
let passed = 0;

function check(label, cond) {
  if (cond) {
    passed++;
    console.log(`  OK   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}`);
  }
}

// --- Mock KV (Map-based) ------------------------------------------------

function makeMockKV() {
  const store = new Map();
  return {
    store,
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async list({ prefix, cursor } = {}) {
      // Nessuna paginazione reale necessaria per il test: una sola pagina.
      const keys = [...store.keys()]
        .filter((k) => !prefix || k.startsWith(prefix))
        .map((name) => ({ name }));
      return { keys, list_complete: true, cursor: undefined };
    },
  };
}

function makeEnv(overrides = {}) {
  return {
    DB: makeMockKV(),
    ALLOW_ORIGIN: "*",
    STATS_SECRET: "topsecret123",
    ...overrides,
  };
}

async function main() {
  console.log("== POST /lead con email valida ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/lead", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "test-agent" },
      body: JSON.stringify({ email: "nicholas@example.com", archetipo: "sprinter" }),
    });
    const res = await worker.fetch(req, env, {});
    const body = await res.json();
    check("status 200", res.status === 200);
    check("body ok:true", body.ok === true);

    const leadKeys = [...env.DB.store.keys()].filter((k) => k.startsWith("lead:"));
    check("una chiave lead: scritta in KV", leadKeys.length === 1);
    if (leadKeys.length === 1) {
      const saved = JSON.parse(env.DB.store.get(leadKeys[0]));
      check("email salvata correttamente", saved.email === "nicholas@example.com");
      check("archetipo salvato correttamente", saved.archetipo === "sprinter");
      check("ua salvato correttamente", saved.ua === "test-agent");
      check("ts presente", typeof saved.ts === "string" && saved.ts.length > 0);
    }
  }

  console.log("== POST /lead con email invalida ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "non-una-email" }),
    });
    const res = await worker.fetch(req, env, {});
    check("status 400", res.status === 400);
    const leadKeys = [...env.DB.store.keys()].filter((k) => k.startsWith("lead:"));
    check("nessuna chiave lead: scritta", leadKeys.length === 0);
  }

  console.log("== POST /lead senza email nel body ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ archetipo: "x" }),
    });
    const res = await worker.fetch(req, env, {});
    check("status 400 se manca email", res.status === 400);
  }

  console.log("== POST /ev via body text/plain (come sendBeacon) ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/ev", {
      method: "POST",
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ ev: "assessment_start" }),
    });
    const res = await worker.fetch(req, env, {});
    check("status 204", res.status === 204);
    const evKeys = [...env.DB.store.keys()].filter((k) => k.startsWith("ev:"));
    check("una chiave ev: scritta in KV", evKeys.length === 1);
    if (evKeys.length === 1) {
      const saved = JSON.parse(env.DB.store.get(evKeys[0]));
      check("nome evento salvato correttamente", saved.ev === "assessment_start");
    }
  }

  console.log("== POST /ev con body non-JSON (tolleranza parsing) ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/ev", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "questo non e' json",
    });
    const res = await worker.fetch(req, env, {});
    check("status 204 anche con body non parsabile", res.status === 204);
    const evKeys = [...env.DB.store.keys()].filter((k) => k.startsWith("ev:"));
    if (evKeys.length === 1) {
      const saved = JSON.parse(env.DB.store.get(evKeys[0]));
      check('ev finisce a "unknown" se non parsabile', saved.ev === "unknown");
    } else {
      check("una chiave ev: scritta comunque", false);
    }
  }

  console.log("== GET /stats con key corretta ==");
  {
    const env = makeEnv();
    // Popola scenario: 2 lead, 3 start, 2 complete -> completion 66.7%, email_capture 100%
    const req1 = new Request("https://worker.example/lead", {
      method: "POST",
      body: JSON.stringify({ email: "a@example.com" }),
    });
    const req2 = new Request("https://worker.example/lead", {
      method: "POST",
      body: JSON.stringify({ email: "b@example.com" }),
    });
    await worker.fetch(req1, env, {});
    await worker.fetch(req2, env, {});

    const evNames = ["assessment_start", "assessment_start", "assessment_start", "assessment_complete", "assessment_complete"];
    for (const ev of evNames) {
      const req = new Request("https://worker.example/ev", {
        method: "POST",
        body: JSON.stringify({ ev }),
      });
      await worker.fetch(req, env, {});
    }

    const statsReq = new Request("https://worker.example/stats?key=topsecret123", { method: "GET" });
    const res = await worker.fetch(statsReq, env, {});
    const body = await res.json();
    check("status 200", res.status === 200);
    check("leads = 2", body.leads === 2);
    check("events_total = 5", body.events_total === 5);
    check("events_by_name.assessment_start = 3", body.events_by_name.assessment_start === 3);
    check("events_by_name.assessment_complete = 2", body.events_by_name.assessment_complete === 2);
    check("completion_rate_pct calcolata (2/3*100=66.7)", body.completion_rate_pct === 66.7);
    check("email_capture_rate_pct calcolata (2/2*100=100)", body.email_capture_rate_pct === 100);
  }

  console.log("== GET /stats con key sbagliata ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/stats?key=wrong", { method: "GET" });
    const res = await worker.fetch(req, env, {});
    check("status 401", res.status === 401);
  }

  console.log("== GET /stats senza key ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/stats", { method: "GET" });
    const res = await worker.fetch(req, env, {});
    check("status 401 se manca key", res.status === 401);
  }

  console.log("== GET /stats con eventi senza nomi riconosciuti (nessuna percentuale finta) ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/ev", {
      method: "POST",
      body: JSON.stringify({ ev: "nome_a_caso" }),
    });
    await worker.fetch(req, env, {});
    const statsReq = new Request("https://worker.example/stats?key=topsecret123", { method: "GET" });
    const res = await worker.fetch(statsReq, env, {});
    const body = await res.json();
    check("nessuna completion_rate_pct se nomi non riconosciuti", body.completion_rate_pct === undefined);
    check("presente un note che lo segnala", typeof body.note === "string" && body.note.length > 0);
  }

  console.log("== OPTIONS preflight (CORS) ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/lead", { method: "OPTIONS" });
    const res = await worker.fetch(req, env, {});
    check("status 204", res.status === 204);
    check("Access-Control-Allow-Origin presente", res.headers.get("access-control-allow-origin") === "*");
    check("Access-Control-Allow-Methods presente", res.headers.get("access-control-allow-methods") === "POST, GET, OPTIONS");
    check("Access-Control-Allow-Headers presente", res.headers.get("access-control-allow-headers") === "Content-Type");
  }

  console.log("== GET / (health check) ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/", { method: "GET" });
    const res = await worker.fetch(req, env, {});
    const text = await res.text();
    check("status 200", res.status === 200);
    check('body = "latente worker ok"', text === "latente worker ok");
  }

  console.log("== Percorso non previsto -> 404 ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/non-esiste", { method: "GET" });
    const res = await worker.fetch(req, env, {});
    check("status 404", res.status === 404);
  }

  console.log("== Metodo non previsto su path esistente -> 404 ==");
  {
    const env = makeEnv();
    const req = new Request("https://worker.example/lead", { method: "DELETE" });
    const res = await worker.fetch(req, env, {});
    check("status 404", res.status === 404);
  }

  console.log(`\nTotale: ${passed} OK, ${failures} FAIL`);
  if (failures > 0) {
    process.exit(1);
  }
}

main();
