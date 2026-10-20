# 🎓 VladSchool — Specifica completa del progetto

> **Slogan:** "Tutta la scuola in un'app"
> **In 3 emoji:** 🧰📚🧪
> **Stato:** Definizione completata tramite questionario interattivo da 200 domande (20 batch).
> Questo documento riassume OGNI decisione presa. È il contratto tra idea e codice.

---

## 1. Visione

**VladSchool non è un registro elettronico.**
È una **cassetta degli attrezzi per studiare**, per studenti e alunni (ma anche per i docenti):
un multitool con **solver di matematica, esperimenti di scienze online, regole di italiano**
e decine di altri strumenti didattici, giochi educativi e funzioni AI.

- **Publico:** studenti/alunni di tutti gli ordini (medie e superiori come focus) **+ docenti**
- **Scopo:** progetto per la mia scuola, poi pubblico
- **Lingua:** solo italiano (nessun'altra lingua prevista)
- **Sistema scolastico:** Italia (voti in decimi, sufficienza 6)
- **Tempistica:** nessuna fretta — si fa per bene
- **Cosa NON deve avere:** abbonamenti, paywall, pubblicità
- **Effetto desiderato:** max WOW (glass, glow, animazioni) — deve impressionare chi lo vede
- **Emozione magic:** il "solver" che accompagna passo-passo, "come se facesse i compiti con te"

---

## 2. Architettura

```
┌──────────────────────────────────────────────┐
│  FRONTEND — vladinc.ru/school                │
│  Web app + PWA (framework moderno, build)    │
│  Mobile-first, funziona offline (senza AI)   │
└──────────────┬───────────────────────────────┘
               │ URL assoluto, HTTPS
┌──────────────▼───────────────────────────────┐
│  BACKEND PHP — vladinc.ru/school/api         │
│  Cartella api/ su SHARED HOSTING             │
│  • Proxy AI (polza.ai) + streaming           │
│  • Auth account online (password hashate)    │
│  • Sync dati, contenuti, log, rate limit     │
│  • CORS: solo dal tuo sito                   │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│  MySQL (config in file .env su FTP,          │
│  prefisso tabelle configurabile da .env)     │
└──────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│  polza.ai (LLM) — chiave API SOLO nel PHP    │
│  Lista modelli con fetch da /v1/models       │
└──────────────────────────────────────────────┘
```

### Decisioni architetturali (dal questionario)

| # | Decisione | Scelta |
|---|-----------|--------|
| 4 | Piattaforma | Web + **PWA installabile** (basta il web, niente app store) |
| 5 | Accesso | **Entrambe**: uso anonimo locale **e** account online |
| — | Tecnologia frontend | **Framework moderno** (a scelta: React/Vue + build) |
| — | Tecnologia backend | **PHP** in `api/` su shared hosting |
| 139 | Dati backend | **MySQL**, configurazione in **file `.env`** (su FTP), **prefisso tabelle configurabile da `.env`** |
| 140 | Chiamata API | **URL assoluto** `https://vladinc.ru/school/api` |
| 141 | CORS | Sì: API richiamabile solo dal sito |
| 142 | Streaming | **Sì**: risposte AI in streaming (parola per parola) |
| 143 | Anti-abuso | **Rate limit** (es. max richieste/ora per utente) |
| 144 | HTTPS | Sì, su vladinc.ru |
| 135 | API key polza.ai | **Solo nel backend PHP**, mai nel browser |

---

## 3. Account, profili e dati

- **Uso anonimo:** tutto funziona in locale sul dispositivo (localStorage/IndexedDB)
- **Account online:** email + password (salvate **cifrare con hash** nel DB); **NO login Google**
- **Ruoli:** **studente** e **docente**
- **Multi-profilo** anche senza account (più utenti sullo stesso dispositivo, dati separati)
- **Sync online** dei dati personali (flashcard, note, medie…) via account
- **Backup manuale** export/import **JSON** sempre disponibile
- **Cancellazione** account e dati con un tap
- **Dati demo** al primo avvio per mostrare l'app
- **Zero tracciamento**, zero vendita dati, pagina privacy scritta semplice (adatta ai minori)
- L'**AI riceve solo il testo necessario** (nessun dato extra)
- Disclaimer: *VladSchool non sostituisce il registro ufficiale*

---

## 4. Design e UX

| Aspetto | Scelta |
|---|---|
| Tema | Chiaro + scuro con **switch** (anche nella barra laterale) |
| Colore principale | **Arancione** |
| Stile | **Moderno: gradienti + glass, glow, max wow effect** |
| Home | **Griglia di icone** degli strumenti |
| Navigazione | **Menu laterale** |
| Layout | **Mobile-first** (perfetto anche su PC) |
| Nome sezioni | **Giocosi** (es. "Quizzone", "Cassetta magica") |
| Splash screen | **Sì**, logo animato all'avvio |
| Mascotte | **Vladino** (con confetti e suoni di celebrazione) |
| Gamification | **NIENTE XP/livelli/classifiche globali** — solo record personali nei giochi |
| Icona/Logo | Generato con AI (prompt in §9), **sostituibile dall'admin con upload** |
| Ricerca globale | Sì (scrivi "pitagora" → trovi il tool) |
| Preferiti + Recenti | Sì |
| Tour primo avvio + mini-guide | Sì, per ogni tool una guida "come funziona" |
| Offline | **Tutto funziona offline tranne le funzioni AI** |
| Accessibilità | Testo regolabile, alto contrasto, tasti grandi, suoni on/off, modalità animazioni ridotte |
| Tutto in italiano | Sì, linguaggio semplice per ragazzi |
| Altri dettagli | Statistiche d'uso private, bottone "segna un bug", pagina Info con versione, **easter egg segreto "VLAD"**, avvisi admin in home |

---

## 5. Le funzioni (tutte confermate SÌ, tranne dove indicato)

### 5.1 🧮 Matematica — *la parte che deve essere PERFETTA subito*
1. **Solver equazioni 1° grado** — passo-passo
2. **Equazioni 2° grado** — delta, formula risolutiva, passo-passo
3. **Sistemi di equazioni** (2 variabili)
4. **Disequazioni**
5. **Frazioni** — tutte le operazioni (+ semplificazione)
6. **Proporzioni** — calcolo della x mancante
7. **Percentuali** — sconto, incremento, x% di n (con spiegazione)
8. **Potenze e radici** — con proprietà spiegate
9. **Calcolatrice scientifica** (sin, cos, log, π…)
10. **Grafici di funzioni** (y = …)
11. **Geometria** — formule **+ calcolo** (aree, perimetri, volumi)
12. **Teorema di Pitagora** — calcolo del lato mancante
13. **Goniometria** — tabella seno/cos/tan + calcolo
14. **MCD e mcm** — con passaggi
15. **Numeri romani** ↔ arabi
16. **Conversioni di unità** (lunghezza, massa, tempo, temperatura…)
17. **Basi numeriche** (binario, decimale, esadecimale)
18. **Statistiche** — media, mediana, moda
19. **Probabilità e combinatoria** (fattoriale, permutazioni)
20. **Espressioni passo-passo** (ordine delle operazioni)
21. **Fattorizzazione e numeri primi**
22. **Insiemi e diagrammi di Venn** (unione, intersezione)
23. **Tabelline** — tabella consultabile (non gioco)
24. **Generatore di esercizi** con verifica automatica

### 5.2 🔬 Scienze — esperimenti online + guide
- **Tavola periodica interattiva** con schede di ogni elemento
- **Bilanciamento reazioni chimiche**
- **Massa molare / peso atomico**
- **Esperimenti di chimica**: simulatore **E** guide sicure da fare a casa
- **Simulatore circuiti elettrici** semplici
- **Fisica**: moto, velocità, forze con simulazioni
- **Ottica**: lenti, specchi, rifrazione
- **Corpo umano interattivo** (sistemi e apparati)
- **Cellula** animale/vegetale esplorabile
- **Sistema solare** e pianeti esplorabili
- **Classificazione esseri viventi** (animali, piante)
- **Vulcani, terremoti e placche** (simulazione/schede)
- **Fasi lunari** e calendario astronomico
- **Meteo e clima** spiegati (nubi, vento, precipitazioni)
- **Genetica semplice** (ereditarietà, alberi genealogici)
- **Registro dei risultati degli esperimenti** (tabelle osservazioni)
- **Quiz di scienze**

### 5.3 📖 Italiano — regole + esercizi
- **Analisi grammaticale automatica** (scrivi la frase → parti del discorso)
- **Coniugatore verbi** (tutti tempi e modi)
- **Analisi logica** (soggetto, predicato, complementi)
- **Analisi del periodo**
- **Ortografia**: accenti, apostrofo, omofoni, doppie
- **Sinonimi e contrari**
- **Figure retoriche** con esempi
- **Tipologie di testo** con guide (descrittivo, narrativo, argomentativo…)
- **Come si scrive**: lettera, email, tema, riassunto (con modelli)
- **Dettati interattivi**
- **Regole**: sia **schede** che **quiz interattivi**

### 5.4 🏛 Storia e Geografia
- **Linee del tempo interattive**
- **Schede di epoche e civiltà** (Egizi, Romani, Greci…)
- **Quiz di storia** (date e personaggi)
- **Quiz capitali del mondo e bandiere**
- **Geografia d'Italia**: regioni, capoluoghi, monti, fiumi
- **Carte geografiche interattive**

### 5.5 🇬🇧 Inglese
- **Verbi irregolari** (tabella + quiz)
- **Schede di grammatica** (tempi, articoli, plurali)
- **Vocabolario per tema** con pronuncia
- **Traduttore integrato**
- **Frasi utili per la classe** ("posso uscire?", "come si dice…")
- **Lettura assistita** (TTS: l'app legge ad alta voce)

### 5.6 🧠 Studiare meglio
- **Flashcard** con mazzi personali
- **Ripetizione spaziata** (le carte difficili tornano prima)
- **Quiz personali** (scrivi domande/risposte, l'app ti interpella)
- **Timer di studio** con pomodoro
- **Mappe concettuali** (editor semplice)
- **Guida al riassunto e allo schema efficace**

### 5.7 🗓 Organizzazione
- **Media dei voti** (voti in decimi, sufficienza 6; medie per materia e totale;
  grafico andamento; simulatore "che voto mi serve"; peso verifiche;
  confronto quadrimestri; trend ultimi voti; export CSV;
  colori automatici insufficienza/sufficienza; nascondi voti al tap)
- **Orario scolastico** (Lun–Sab configurabile, fasce personalizzabili, aula e prof,
  vista "OGGI" con lezione corrente, orario A/B alternato, colori materie,
  widget prossima lezione, festivi, condivisione come immagine)
- **Compiti e verifiche** (materia, scadenza, stati da fare/in corso/fatto, priorità,
  promemoria "scade domani", testo+link, subtask, vista oggi/settimana,
  archivio automatico, timer studio, statistiche, calendario verifiche con countdown,
  argomenti + checkbox "studiato", pianificatore pre-verifica, carico settimanale, export ICS)
- **To-do list** semplice
- **Note veloci** (blocco appunti)
- **Registro assenze** (per giorno/materia, contatore, ritardi/uscite anticipate,
  allarme limite, giustificato sì/no, statistiche, "quante assenze posso permettermi",
  note disciplinari, diario personale)
- **Materie personalizzabili** (prof, aula, colore, argomenti svolti, link/file, libri, codici)
- **Anni ed esami** (anni archiviati, due quadrimestri, credito scolastico,
  simulatore voto esame, debiti/recuperi)
- **Conto alla rovescia alle vacanze** 😄

### 5.8 🎨 Creatività
- **Lavagna bianca** per disegnare e schematizzare
- **Generatore copertine** per temi e progetti
- **Mini-presentazioni** (slide semplici da mostrare in classe)
- **Simboli e caratteri speciali** (π, ∑, →, ★) pronti da copiare
- **Citazioni** di personaggi storici e scienziati
- **Export come immagine** delle creazioni

### 5.9 🎮 Giochi educativi
- **Quiz a tempo** di matematica
- **Impiccato** con parole italiane difficili
- **Indovina capitale / bandiera**
- **Memory e cruciverba** educativi
- **Sudoku e logica**
- **Record personali + classifica locale** (niente classifica globale)

### 5.10 📅 Tutto il resto quotidiano
- Contapresenze, cronometro e timer, registro prestiti, generatore password,
  convertitore valute, QR reader, formulario fisica/matematica, estrazione nomi, dado e moneta

### 5.11 👨‍🏫 Strumenti docenti (in v1)
- **Estrattore nomi casuali** per interrogazioni (con animazione)
- **Griglie di valutazione** (rubriche) generabili
- **Generatore esercizi stampabili** (matematica, verbi…)
- **Gestione classi**: elenchi studenti con note
- **Registro rapido compiti** (sì/no per classe)
- **Cronometro interrogazioni** con tempi
- I docenti possono **creare quiz/esercizi e condividerli con la classe**

### 5.12 🤖 Funzioni AI (polza.ai)
1. **"Spiega come a scuola"** — l'AI spiega ogni soluzione passo-passo in italiano semplice
2. **Correzione AI** di temi e frasi (errori + suggerimenti)
3. **Tutor chat** — chiedi qualsiasi cosa di scuola
4. **Generatore AI** di quiz ed esercizi su un argomento
5. **Riassunti AI** — incolli un testo e lo schematizza

Regole:
- I tool non-AI **restano pienamente usabili offline**; le funzioni AI richiedono la connessione
- L'AI riceve **solo il testo necessario**

---

## 6. Backend PHP — `api/` (dettaglio)

Percorso pubblico: `https://vladinc.ru/school/api` — struttura logica:

```
api/
├── index.php          # front controller / router
├── .env               # configurazione (su FTP, MAI nel repo)
├── .htaccess          # protezione file sensibili, rewrite
├── src/
│   ├── Config.php     # lettura .env
│   ├── Db.php         # MySQL (PDO) con prefisso tabelle da .env
│   ├── Auth.php       # registraz./login (password_hash), sessioni/JWT
│   ├── RateLimit.php  # limiti per utente/IP
│   ├── Ai.php         # proxy polza.ai (chat completions + streaming)
│   ├── Models.php     # GET modelli → fetch /v1/models
│   ├── Sync.php       # sync dati account
│   ├── Content.php    # contenuti didattici gestiti da admin
│   └── Log.php        # log richieste AI
└── admin/             # ADMIN PANEL
    ├── index.php      # login admin
    └── ...            # vedi §7
```

**`.env` (esempio, su FTP, fuori dal repository):**
```
DB_HOST=localhost
DB_NAME=vladschool
DB_USER=...
DB_PASS=...
DB_TABLE_PREFIX=vs_
POLZA_API_KEY=...
POLZA_BASE_URL=https://api.polza.ai/v1
ADMIN_USER=...
ADMIN_PASS_HASH=...
RATE_LIMIT_HOURLY=60
ALLOWED_ORIGIN=https://vladinc.ru/school
```

**Endpoint previsti (base `/api`):**
- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `POST /ai/chat` (streaming SSE) — tool → modello risolto dal mapping admin
- `GET /ai/models` — proxy della lista modelli (da polza `/v1/models`)
- `GET/PUT /sync` — backup/sync dati account
- `GET /content`, `POST /content` (admin) — contenuti didattici/quiz
- `GET /admin/*` — configurazione, test API, log (protetto da login admin)
- `POST /feedback` — bottone "segna un bug"

**Sicurezza:** CORS allowlist, password `password_hash()` (bcrypt/argon2),
chiave AI solo server-side, rate limit, HTTPS, input validati, prepared statements.

---

## 7. Admin panel (protetto da login)

Funzioni confermate:
1. **Configurazione AI**: scegliere **un modello per OGNI tool**;
   la **lista modelli si carica con fetch da `/v1/models`** di polza.ai
2. **Test di connessione** ("prova il modello") direttamente dall'admin
3. **Log richieste AI**: data, tool, modello, esito (ok/errore)
4. **Upload logo**: sostituzione dell'icona/logo dell'app
5. **Gestione contenuti**: aggiornamento contenuti didattici e quiz preconfezionati
6. **Avvisi in home**: messaggi tipo "novità" o "manutenzione"
7. **Gestione utenti** e dati di base

---

## 8. Contenuti didattici

- Contenuti e **quiz preconfezionati inclusi** nell'app (centinaia di domande:
  matematica, italiano, scienze, storia, geografia, inglese)
- **Due livelli**: scuole medie e superiori
- Aggiornamento contenuti: **dall'admin panel**
- I **docenti** possono creare quiz/esercizi e **condividerli con la classe**
- Tutto **offline-ready** (contenuti inclusi nel bundle/asset locali)

---

## 9. Logo e mascotte

- **Mascotte:** Vladino 🦇 (con confetti e suoni di celebrazione; presente in guide e quiz)
- **Logo:** generato con AI; il prompt ufficiale:

> *"Modern flat vector app icon for 'VladSchool', a friendly school multitool app.
> A cute little cartoon bat named Vladino wearing round glasses and a graduation cap,
> smiling, holding a tiny book. Bold orange (#FF7A00) accent color, deep indigo night
> background, subtle glow, rounded squircle app-icon shape, glassmorphism highlights,
> minimal, crisp edges, no text."*

- Il logo **si può sostituire dall'admin panel** caricando una nuova immagine
- Favicon coerente con il logo; splash screen animata con il logo

---

## 10. Roadmap

**v1 (tutto insieme, nessuna fretta — qualità prima di tutto):**
1. Setup progetto: frontend framework moderno + PWA, backend PHP `api/`, MySQL `.env`
2. Design system (arancio, glass, dark switch, sidebar, griglia icone, Vladino, splash)
3. **Matematica completa** (§5.1) — la parte da rendere perfetta
4. Scienze, Italiano, Storia/Geo, Inglese (§5.2–5.5)
5. Studio, Organizzazione, Creatività, Giochi (§5.6–5.9)
6. Docenti (§5.11) + contenuti + admin panel (§6–7)
7. AI polza.ai con streaming, mapping modelli per tool, log, rate limit (§5.12, §6)
8. Account, sync, backup, privacy (§3)
9. PWA, offline, accessibilità (§4)
10. Test con l'utente direttamente qui in chat (anteprima live)

**Dopo la v1 (non in scope):** app store, altre lingue, login Google, community aperta.

---

## 11. Risposte incomplete / default applicati

Durante il questionario 3 domande sono arrivate con commento "perché me lo chiedi /
non è per questa app": per queste vale il buon senso (decise dall'assistente):
- Tipi valutazione: numerici in decimi; sufficienza fissa 6; media aritmetica con
  peso opzionale per verifica; niente pesata per crediti (non prioritaria)
- Dati demo al primo avvio: **sì** (mostre l'app, poi si resettano)
- "Strumento n°1": **il solver di matematica** (la parte perfetta subito)

---

*Spec scritta il 2026-10-20 dopo le 200 domande interattive. VladSchool 🧰📚🧪*
