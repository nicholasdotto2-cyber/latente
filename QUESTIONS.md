# QUESTIONS.md — Le 29 domande dell'assessment

> Figlio di [ASSESSMENT-DESIGN.md](ASSESSMENT-DESIGN.md). Questo è il copy definitivo che l'utente legge.
> Notazione: `[SEMINA-X]` / `[RACCOGLIE-X]` = coppia di contraddizione X. `(dim N)` = dimensione misurata. Punteggi 0-3: più alto = più bloccato.
> Rev. 2 (2026-07-02): aggiunta Q2 proiettiva; vecchia Q20 (acquisti) sostituita — mai nominare soldi/acquisti prima della richiesta email.
> Rev. 3 (2026-07-08): allineato alla v1 live. Rimosse Q1 (perché sei qui) e Q31 (intenzione finale) → 29 domande. **Gli id interni restano 2-30** (stabili, così `ans`/HOOKS/PAIRS/openTxt non slittano); la numerazione mostrata all'utente è per posizione nel flusso ("Domanda 1 di 29"…"29 di 29"). Riscritte tutte le opzioni delle domande punteggiate perché coprano più casi (ordine di gravità e array score invariati → motore identico). Titolo Cap.1 «Chi credi di essere» → «Come ti vedi». Archetipo dim5 ora «Il Senza Rotta» (era «L'Occupato»). Modifiche fatte prima su v1 (assessment.html, in produzione), poi propagate a v2.html e v3.html: i blocchi di logica condivisa (CHAPTERS/Q/DIMS/ARCH/STEPS/HOOKS/PAIRS/compute/updProg) sono ora byte-identici tra le 3 varianti; cambia solo la skin.

---

## Regola NO-AI — guida di voce (vincolante per ogni testo qui dentro)

Il testo deve suonare come un documentarista che ti intervista, non come un'app. Concretamente:

**Vietato:** "Scopri il tuo potenziale", "il tuo viaggio", "Inoltre", elenchi perfettamente simmetrici, tre aggettivi in fila, "non è X, è Y" più di una volta ogni tanto, chiusure motivazionali, punti esclamativi di entusiasmo, emoji, il voi, qualsiasi frase che potrebbe stare in una newsletter aziendale.

**Obbligatorio:** frasi corte. Dare del tu. Dettagli concreti (il telefono, la tab, il 2x, i salvati). Un filo di ironia asciutta. Ritmo irregolare, come si parla. Se una frase suona "levigata", sporcala.

**Regola soldi:** mai nominare acquisti, corsi comprati, abbonamenti o spese prima della richiesta email finale. Niente deve far pensare "questa cosa poi me la fanno pagare".

---

## CAPITOLO 1 — Come ti vedi

*Intro:* «Partiamo da come ti vedi. Di pancia, senza pensarci troppo.»

**Q2** — Se ti capita di svegliarti nel cuore della notte e la testa parte da sola: dove va, di solito? *(proiettiva — non punteggiata, alimenta la narrativa; indicizza HOOKS)*
- Alla lista delle cose da fare domani
- A un errore vecchio, una figuraccia, una cosa detta male
- Al futuro: soldi, tempo, dove sto andando
- Da nessuna parte. Crollo e dormo

**Q3** `[SEMINA-D]` *(dim 1)* — Quando sai per certo che una cosa ti fa bene, poi la fai?
- Quasi sempre. Non perfetto, ma la faccio (0)
- Spesso, se la vita non si mette in mezzo (1)
- A fasi: parto convinto, poi si perde per strada (2)
- Raramente. E non è che non lo so (3)

**Q4** `[SEMINA-A]` *(dim 3)* — Quando tutto il resto spinge, qual è la cosa che difendi coi denti?
- Il sonno
- L'allenamento
- Il tempo per la mia testa
- Le persone a cui tengo
*(non punteggiata — serve solo alla coppia A)*

**Q5** `[SEMINA-B]` *(dim 4)* — Quando lavori a una cosa che conta, il tuo focus com'è?
- Tunnel. Sparisco, il mondo aspetta fuori (0)
- Buono, se l'ambiente collabora (1)
- A onde: un po' dentro, un po' fuori, di nuovo dentro (2)
- Focus è una parola grossa, ultimamente (3)

**Q6** `[SEMINA-C]` *(dim 2)* — Che posto ha l'imparare cose nuove nella tua vita?
- È parte di chi sono, non riesco a smettere (0)
- Mi piace, quando trovo roba che vale (1)
- A ondate: periodi che divoro tutto, periodi niente (2)
- Poco, sinceramente. Vivo, più che studiare (3)

**Q7** `[SEMINA-E]` *(dim 6)* — Un amico molla tutto. Di nuovo. Te lo dice a cena: tu che gli rispondi?
- Lo ascolto e basta, capita
- Gli ricordo che non è la fine del mondo
- Lo aiuto a capire dove si è rotto
- Gli dico quello che nessuno gli dice
*(non punteggiata — serve alla coppia E: registra il tono verso gli altri)*

**Q8** `[SEMINA-F]` *(dim 5)* — Tra tre anni. Quanto è chiara l'immagine di dove vuoi essere?
- Nitida. La vedo, coi dettagli (0)
- A grandi linee. La direzione c'è (1)
- Cambia ogni mese, a seconda del periodo (2)
- Buio. Non riesco nemmeno a immaginarla (3)

---

## CAPITOLO 2 — La tua giornata vera

*Intro:* «Adesso lascia perdere com'è "di solito". Parliamo di ieri.»

**Q9** `[RACCOGLIE-A]` *(dim 3)* — Ieri sera, gli ultimi trenta minuti prima di chiudere gli occhi. Cosa avevi davanti?
- Un libro, due chiacchiere, o niente (0)
- Una serie, un film, qualcosa in TV (1)
- Il telefono. Scroll, chat, un po' di tutto (2)
- Lavoro, o pensieri di lavoro (3)

**Q10** `[RACCOGLIE-A]` *(dim 3)* — Le ultime tre sere, a che ora hai spento davvero?
- Prima delle 23, più o meno (0)
- Tra le 23 e mezzanotte (1)
- Dopo mezzanotte, almeno una sera (2)
- Dopo mezzanotte, praticamente sempre (3)

**Q11** *(dim 3)* — Stamattina come ti sei alzato?
- Carico, o quasi (0)
- Normale. Il caffè fa il resto (1)
- Trascinandomi, ma sono partito (2)
- Non ricordo l'ultima volta che mi sono svegliato riposato (3)

**Q12** `[RACCOGLIE-B]` *(dim 4)* — L'ultima volta che hai fatto una cosa importante: quante volte hai preso in mano il telefono?
- Zero, o quasi: era lontano (0)
- Un paio di volte, poi basta (1)
- Ho perso il conto (2)
- A ripensarci, il telefono era la cosa importante (3)

**Q13** `[RACCOGLIE-B]` *(dim 4)* — Quanto resisti su una cosa sola prima di aprire un'altra scheda, un'altra app, qualsiasi cosa?
- Mezz'ora e più, se serve (0)
- Dieci, quindici minuti buoni (1)
- Cinque minuti, a essere generosi (2)
- Non me ne accorgo nemmeno più: cambio e basta (3)

**Q14** *(dim 3)* — Ieri, in che momento eri al massimo dell'energia?
- Mattina presto, appena in piedi (0)
- In giornata: tarda mattinata o pomeriggio (1)
- Sera, quando il resto si spegne (2)
- Mai. Ieri è stata piatta dall'inizio alla fine (3)

**Q15** *(dim 4)* — Di tutte le ore sveglio di ieri, quante le rifaresti uguali?
- Quasi tutte (0)
- Più della metà (1)
- Poche. Il grosso è scivolato via (2)
- Ieri è passato e basta (3)

---

## CAPITOLO 3 — Quello che consumi

*Intro:* «Podcast, libri, video, corsi. Vediamo che fine fa tutta la roba che entra.»

**Q16** *(dim 2)* — Quanti contenuti su crescita, produttività, salute ti passano davanti in una settimana?
- Quasi zero. Non è il mio mondo (0)
- Qualcuno, scelto. So cosa sto guardando (1)
- Parecchi. Sono il mio sottofondo fisso (2)
- Tantissimi, spesso a 2x mentre faccio altro (3)

**Q17** `[RACCOGLIE-C]` *(dim 2)* — Pensa all'ultimo podcast o libro di crescita che hai finito. C'è una cosa che hai applicato e che fai ancora oggi?
- Sì, almeno una. E la faccio ancora (0)
- L'ho applicata per un po'. Poi la vita, e si è persa (1)
- Il concetto lo ricordo. Provarlo, mai davvero (2)
- Non saprei nemmeno dirti l'ultimo che ho finito (3)

**Q18** `[RACCOGLIE-C]` *(dim 2)* — I tuoi salvati. Video, articoli, post "da riguardare". Quanti ne hai riaperti?
- Li riapro. Non tutti, ma li uso (0)
- Qualcuno l'ho ripreso. La minoranza (1)
- Quasi nessuno. È un cimitero (2)
- Non salvo niente, tanto so già come finisce (3)

**Q19** `[RACCOGLIE-D]` *(dim 1)* — C'è una cosa che sai da almeno un anno che dovresti fare. E non la fai.
- Sì. E il motivo per cui non parte lo conosco pure (2)
- Sì. E non ho capito nemmeno io perché resta lì (3)
- Più di una. Ho smesso di contarle (3)
- No: se una cosa la so, prima o poi la faccio (0)

**Q20** *(dim 1)* — Trovi un metodo nuovo che ti convince. Cosa succede nei tre giorni dopo?
- Lo provo subito, anche a costo di mollare quello di prima (1)
- Lo metto in lista, con le migliori intenzioni (2)
- Lo salvo da qualche parte, e lì resta (2)
- Ne parlo, ci penso, e piano piano svanisce (3)
*(risposta "lo provo e tengo anche il resto" volutamente assente: chi prova tutto accumula — punteggio minimo 1)*

**Q21** *(dim 1)* — Le abitudini che hai provato a costruire nell'ultimo anno. Quante sono ancora vive oggi?
- Quelle che contavano reggono ancora (0)
- Un po' e un po'. Qualcuna è viva (1)
- Ne ho iniziate tante. Ne sarà rimasta una (2)
- A un certo punto ho smesso anche di iniziare (3)

---

## CAPITOLO 4 — Sotto la superficie

*Intro:* «Qui di solito la gente rallenta. Prenditi il tempo che serve.»

**Q22** `[RACCOGLIE-E]` *(dim 6)* — Sbagli una cosa che contava. La prima frase che ti parte in testa, quella vera?
- Niente di particolare. La chiudo lì e vado avanti (2)
- "Sono sempre il solito", o una variante sua (3)
- "Lo sapevo". Quasi con soddisfazione (2)
- "Ok. Cosa sistemo?" (0)

**Q23** *(dim 6)* — C'è una cosa che rimandi non perché è difficile, ma perché ti mette a disagio. Quanto le giri intorno?
- Non ce l'ho: le cose scomode le tolgo di mezzo per prime (0)
- Ce l'ho. Ogni tanto la guardo, poi la risposto (1)
- Ci giro intorno da settimane, forse mesi (2)
- Ci giro intorno da così tanto che ormai fa parte del panorama (3)

**Q24** *(dim 6)* — Quando le cose vanno bene per un po', la tua testa cosa fa?
- Si annoia e va a cercarsi un casino nuovo (3)
- Trova il difetto. C'è sempre (2)
- Aspetta. Prima o poi qualcosa si rompe (2)
- Se le gode, finché dura (0)

**Q25** *(dim 6)* — Rispetto a chi ti senti più spesso indietro?
- A nessuno in particolare. Corro la mia gara (0)
- A colleghi, amici, gente che conosco davvero (1)
- A gente vista online, che nemmeno conosco (2)
- A una versione di me che non arriva mai (3)

**Q26** — **APERTA** *(alimenta la narrativa — `openTxt[26]`)*
Scrivi la frase esatta che ti dici quando molli qualcosa. Le parole vere, come te le dici in testa.

---

## CAPITOLO 5 — Dove stai andando

*Intro:* «Ultimo capitolo. Alza la testa.»

**Q27** `[RACCOGLIE-F]` *(dim 5)* — Questa settimana hai fatto qualcosa che ti avvicina a dove vuoi essere tra tre anni?
- Più d'una cosa, se ci penso (0)
- Una, precisa. Piccola ma vera (1)
- La settimana era piena, ma di altro (2)
- Non saprei dirne una (3)

**Q28** *(dim 5)* — Le tue giornate si riempiono comunque, di tanto o di poco. Di cosa, di solito?
- Non lo so nemmeno io. Passano e basta (3)
- Di cose piovute addosso: richieste, urgenze, imprevisti (2)
- Metà scelte da me, metà arrivate da fuori (1)
- Quasi tutte cose che ho scelto io (0)

**Q29** *(dim 5)* — Se da domani avessi tre ore libere al giorno, garantite: sai già cosa ci faresti?
- Sì, lo so già. Anche da dove comincerei (0)
- Un'idea ce l'ho, da mettere a fuoco (1)
- Temo che si riempirebbero come tutte le altre (2)
- Onestamente? Un po' di panico (3)

**Q30** — **APERTA** *(alimenta la narrativa — `openTxt[30]`)*
Dove vuoi essere tra tre anni? Una riga. Se ti esce vaga, scrivila vaga: anche quello dice qualcosa.

---

## Le 6 coppie di contraddizione — regole di attivazione

Tutte le condizioni lavorano sugli **INDICI di risposta** (0-3), mai sugli score. La contraddizione mostrata nel profilo cita testualmente le risposte. Se ne scattano più d'una: si mostra quella sulla dimensione più bloccata.

| Coppia | Nome nel profilo | Scatta se (indici) | Riga tipo nel profilo |
|---|---|---|---|
| **A** | Il sonno tradito | Q4 = 0 (il sonno) **E** (Q9 ≥ 2 **O** Q10 ≥ 2) | «Hai detto che il sonno è la cosa che difendi coi denti. Poi ieri sera gli ultimi trenta minuti erano di scroll / di lavoro / davanti a uno schermo, e hai spento [ora da Q10]. Coi denti, dicevi.» |
| **B** | Il focus immaginato | Q5 ≤ 1 **E** (Q12 ≥ 2 **O** Q13 ≥ 2) | «Ti sei descritto come uno da tunnel / dal focus buono. Poi, sull'ultima cosa importante, hai perso il conto delle volte che hai preso il telefono. Il tunnel ha parecchie uscite.» |
| **C** | Il collezionista | Q6 ≤ 1 **E** (Q17 ≥ 2 **O** Q18 = 2) | «Imparare "è parte di chi sei", hai detto. Però dell'ultimo podcast ricordi solo il concetto / non ricordi quale fosse, e i salvati li hai chiamati tu: un cimitero. Tanta roba che entra, poca che esce.» |
| **D** | La cosa che sai da un anno | Q3 ≤ 1 **E** Q19 ≤ 2 (una delle tre risposte "sì"/"più di una") | «Dici che quando sai che una cosa ti fa bene, la fai. Poi c'è quella cosa che sai da un anno — più di una, hai detto. Un anno. La conosci per nome e non parte.» |
| **E** | Il doppio standard | Q7 ∈ {0 ascolto, 1 non è la fine del mondo} **E** Q22 ∈ {1, 2} | «All'amico che molla diresti "capita" / "non è la fine del mondo". A te stesso dici "sono sempre il solito" / "lo sapevo". Con tutti sei gentile, tranne che con uno.» |
| **F** | La chiarezza dichiarata | Q8 ≤ 1 **E** Q27 ≥ 2 | «L'immagine dei tre anni la vedi nitida / a grandi linee. Poi questa settimana, di passi verso quell'immagine: la settimana era piena ma di altro / non sapresti dirne una. Hai la mappa appesa al muro e il motore spento.» |

## Mappa punteggi → dimensioni → archetipi

| Dim | Nome (DIMS) | Domande punteggiate | Array score | Max | Archetipo se dominante (ARCH) |
|---|---|---|---|---|---|
| 1 Azione | intenzione-azione | Q3, Q19, Q20, Q21 | Q3 [0,1,2,3] · Q19 [2,3,3,0] · Q20 [1,2,2,3] · Q21 [0,1,2,3] | 12 | **Il Teorico** |
| 2 Pratica | consumo vs pratica | Q6, Q16, Q17, Q18 | tutte [0,1,2,3] | 12 | **Il Collezionista** |
| 3 Energia | energia e recupero | Q9, Q10, Q11, Q14 | tutte [0,1,2,3] | 12 | **Lo Sprinter** |
| 4 Attenzione | attenzione | Q5, Q12, Q13, Q15 | tutte [0,1,2,3] | 12 | **Il Disperso** |
| 5 Direzione | direzione | Q8, Q27, Q28, Q29 | Q8/Q27/Q29 [0,1,2,3] · Q28 [3,2,1,0] | 12 | **Il Senza Rotta** |
| 6 Dialogo interno | dialogo interno | Q22, Q23, Q24, Q25 | Q22 [2,3,2,0] · Q23 [0,1,2,3] · Q24 [3,2,2,0] · Q25 [0,1,2,3] | 12 | **Il Giudice** |

- Punteggio dimensione = somma/12, normalizzato 0-100 (100 = bloccato).
- **Archetipo = dimensione col punteggio peggiore.** Pareggio: vince la dimensione con una contraddizione scattata; se ancora pari, ordine di priorità 2, 1, 6, 4, 3, 5 (le più distintive per questo target prima).
- Flag `noConsume` in `compute()`: legato a Q16 = 0 ("Quasi zero") con Q17 = 3 o Q18 = 3 — evita di assegnare Il Collezionista a chi non consuma contenuti.
- Q2, Q4, Q7, Q26, Q30 non fanno punteggio: servono a coppie, narrativa e apertura.

## Cosa riceve Haiku (input della narrativa)

Solo: archetipo, i due punteggi peggiori, la contraddizione principale con le risposte testuali, Q26 e Q30 verbatim, e Q2. Con la guida di voce NO-AI nel prompt (vedi ASSESSMENT-DESIGN.md). Haiku racconta, non diagnostica. La Q2 (le tre di notte) è oro per l'apertura del profilo e indicizza `HOOKS`: «Alle tre di notte la tua testa va a [risposta]. Partiamo da lì.»

> Nota: `WORKER_URL` è ancora `null` — la narrativa Haiku non è cablata in produzione. Il profilo attuale usa i testi statici di `ARCH`/`STEPS` più la riga di contraddizione generata da `PAIRS[].txt()`.
