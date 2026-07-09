# Latente Worker — backend minimo per l'assessment

Cloudflare Worker che riceve i lead (email) e gli eventi di tracking emessi
dal client statico (`assessment.html`, `v2.html`, `v3.html`), salvando tutto
in Cloudflare KV. Nessun database relazionale, nessun framework.

## Endpoint

- `POST /lead` — body `{ email, archetipo? }`. Valida l'email con una regex
  semplice; se non valida risponde 400. Salva in KV una chiave
  `lead:<ISO-timestamp>:<random>`. Risponde `200 { ok:true }`.
- `POST /ev` — body `{ ev, data? }`, arriva via `navigator.sendBeacon` quindi
  spesso con `Content-Type: text/plain` (il parsing e' tollerante). Salva in
  KV una chiave `ev:<ISO-timestamp>:<random>`. Risponde `204` (nessun body,
  come richiesto da sendBeacon — niente preflight necessario).
- `GET /stats?key=SECRET` — protetto da `STATS_SECRET`. Se `key` non
  corrisponde risponde `401`. Altrimenti conta i lead totali e gli eventi
  raggruppati per nome (`events_by_name`). Vedi sotto sui nomi-evento.
- `GET /` — health check, risponde `200 "latente worker ok"`.
- Tutto il resto (metodi/percorsi non previsti) → `404`.

CORS: `OPTIONS` gestito con header CORS su ogni risposta
(`Access-Control-Allow-Origin`, `-Methods: POST, GET, OPTIONS`,
`-Headers: Content-Type`). L'origine consentita e' configurabile via
`env.ALLOW_ORIGIN` (default `*` — DA RESTRINGERE in produzione, vedi sotto).

## ATTENZIONE — nomi-evento reali da verificare

`/stats` conta e raggruppa TUTTI gli eventi che arrivano per nome
(`events_by_name`), perche' da questa cartella non ho la certezza di quali
nomi il client emetta davvero in `track()` dentro `assessment.html`/`v2.html`/
`v3.html` (non li ho toccati, come richiesto).

Il Worker prova ANCHE a riconoscere in automatico i due eventi che servono
per le percentuali go/no-go di `IDEA.md`, cercando questi nomi (case
insensitive) dentro `events_by_name`:

- **avvio assessment**: `assessment_start`, `start`, `quiz_start`, `started`
- **completamento assessment**: `assessment_complete`, `complete`,
  `completed`, `quiz_complete`, `finish`, `finished`

Se trova un match per entrambi, calcola e aggiunge alla risposta:

- `completion_rate_pct` = completamenti / avvii * 100
- `email_capture_rate_pct` = lead totali / completamenti * 100

Se NON trova un match, la risposta include comunque `events_by_name` (i
conteggi grezzi) e un campo `note` che lo segnala esplicitamente — non
finge percentuali che non ha.

**Azione per Nicholas**: apri `assessment.html`/`v2.html`/`v3.html`, guarda
le chiamate a `track(...)` (o come si chiama la funzione che invoca
`sendBeacon`), e dimmi i nomi ESATTI degli eventi di avvio e completamento.
Se non corrispondono alla lista sopra, aggiorno le due liste `startCandidates`
/ `completeCandidates` in `src/index.js` (poche righe, nessun'altra modifica
necessaria).

## Deploy (da fare tu, account tuo — io non ho toccato nulla di cloud)

Da dentro questa cartella (`worker/`):

```bash
npm i -g wrangler
# oppure: npx wrangler <comando>, senza installare globalmente

wrangler login

# Crea il namespace KV di produzione e quello di preview
wrangler kv namespace create DB
wrangler kv namespace create DB --preview
```

Ognuno dei due comandi stampa un `id`. Incollali in `wrangler.toml`:

```toml
kv_namespaces = [
  { binding = "DB", id = "ID-DI-PRODUZIONE", preview_id = "ID-DI-PREVIEW" }
]
```

Poi imposta il secret per proteggere `/stats` (NON va in `wrangler.toml`,
i secret sono cifrati lato Cloudflare):

```bash
wrangler secret put STATS_SECRET
# ti chiede il valore, scegline uno lungo e a caso
```

Deploy:

```bash
wrangler deploy
```

Il comando stampa un URL del tipo `https://latente-worker.<tuo-account>.workers.dev`.

## Dopo il deploy

1. **Passa quell'URL a Claude**: va inserito come valore della costante JS
   `WORKER_URL` in `assessment.html`, `v2.html` e `v3.html` (una riga ciascuno
   — il client e' gia' cablato per usarla, come da istruzioni originali). Io
   non ho toccato quei file in questo task.
2. **Restringi `ALLOW_ORIGIN`**: in `wrangler.toml`, sotto `[vars]`, cambia
   `ALLOW_ORIGIN = "*"` con il dominio reale di GitHub Pages, es.
   `https://nicholasdotto2-cyber.github.io`. Poi rilancia `wrangler deploy`.
   Il valore `*` va bene solo per l'MVP/test iniziale.
3. **Unsubscribe/GDPR**: questo MVP salva solo email + timestamp + user agent,
   senza alcun meccanismo di opt-out. Prima di spingere volume reale (invii
   di follow-up alle email raccolte), va aggiunto un flusso di unsubscribe
   vero (link di cancellazione, registro dei consensi). Non incluso qui:
   fuori scope per la validazione go/no-go dei due numeri.
4. **Leggere le statistiche**: `GET https://<worker-url>/stats?key=<STATS_SECRET>`.

## Verifica logica (fatta, senza deploy)

La logica dei 4 endpoint e' verificata da un test Node
(`test/index.test.mjs`) che importa direttamente `src/index.js` (e' ESM puro,
nessuna API Cloudflare-specifica oltre a `env.DB` che viene mockato con una
`Map`), costruisce `Request` fittizie con l'API `fetch` nativa di Node, e
chiama `worker.fetch(request, env)`.

Esegui:

```bash
node test/index.test.mjs
```

Vedi il file per l'elenco esatto degli scenari testati (lead valida/invalida,
ev via text/plain, stats con key giusta/sbagliata, OPTIONS/CORS).
