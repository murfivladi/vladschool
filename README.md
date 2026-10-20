# VladSchool — Tutta la scuola in un'app

> **Slogan:** "Tutta la scuola in un'app"  
> **Emoji:** 🧰📚🧪  
> **Stato:** v1 in sviluppo — scaffold iniziale

Multitool didattico per studenti e docenti: solver di matematica, esperimenti di scienze, regole di italiano, giochi educativi, organizzazione, flashcard e funzioni AI (polza.ai).

---

## 🗂 Struttura del repository

```
vladschool/
├── index.html              # App shell PWA (punto di ingresso)
├── manifest.json           # Manifesto PWA
├── sw.js                   # Service Worker (offline-first)
├── css/
│   └── style.css           # Design system (arancio, glass, dark mode)
├── js/
│   └── app.js              # Logica app (vanilla JS)
├── assets/
│   ├── icon-72/96/128/192/512.png   # Icone PWA
│   └── screenshot-mobile.png        # Screenshot store
├── api/                    # Backend PHP (su shared hosting, su FTP)
│   ├── index.php           # Front controller / router
│   ├── .htaccess           # Protezione + rewrite
│   ├── .env.example        # Esempio configurazione (NON committare .env)
│   ├── admin/
│   │   └── index.php       # Login admin panel
│   └── src/
│       ├── Config.php      # Lettura variabili da .env
│       ├── Db.php          # MySQL PDO + prefisso tabelle
│       ├── Auth.php        # Registrazione/login (password_hash)
│       ├── RateLimit.php   # Limiti richieste/ora
│       ├── Ai.php          # Proxy polza.ai (chat + modelli)
│       ├── Models.php      # GET /v1/models
│       ├── Sync.php        # Backup/sync dati account
│       ├── Content.php     # Contenuti didattici
│       └── Log.php         # Log richieste AI
├── .github/
│   ├── workflows/deploy.yml       # GitHub Actions deploy FTPS (self-hosted)
│   └── SELF_HOSTED_RUNNER.md      # Guida runner + segreti
└── spec.md                 # Specifica completa (200 domande)
```

---

## 🚀 Avvio rapido (sviluppo locale)

Il frontend è statico HTML/CSS/JS: basta aprire `index.html` nel browser o servilo con un server locale:

```bash
# con Python
python3 -m http.server 8000

# con Node (serve)
npx serve .
```

Poi visita `http://localhost:8000`. L'app funziona anche offline grazie al Service Worker.

---

## 🖥️ Backend PHP (shared hosting)

1. Carica la cartella `api/` sul server FTP nella cartella desiderata (es. `/school/api`).
2. Copia `api/.env.example` in `api/.env` e compila i valori reali (DB, chiave polza.ai, admin).
3. Importa/crea le tabelle MySQL: il codice le crea automaticamente al primo utilizzo (`users`, `sync`, `content`, `rate_limit`, `ai_log`).
4. Proteggi `.env` e `src/` con l'.htaccess già incluso.

Endpoint base: `https://vladinc.ru/school/api`

---

## 📦 Deploy automatico (GitHub Actions + self-hosted runner)

Workflow: `.github/workflows/deploy.yml`

- Si attiva su push a `main` o tramite `workflow_dispatch`.
- Gira su un **self-hosted runner** (`runs-on: self-hosted`).
- Esegue il build frontend (se `package.json` presente) e deploya via **FTPS** su `FTP_DIR`.

### Segreti richiesti (GitHub Settings → Secrets and variables → Actions)

| Segreto | Esempio |
|---------|---------|
| `FTP_SSL` | `true` |
| `FTP_HOST` | `ftp.vladinc.ru` |
| `FTP_USER` | `utente_ftp` |
| `FTP_PASS` | `password_ftp` |
| `FTP_DIR` | `/httpdocs/school` |

Vedi `.github/SELF_HOSTED_RUNNER.md` per configurare il runner.

> Il file `.env` del backend resta sul server (fuori dal repo) e **non viene sovrascritto** dal deploy.

---

## 🎨 Tema

- Colore principale: **Arancione** `#FF7A00`
- Sfondo notte: **Indigo** `#1E1B4B`
- Tema chiaro/scuro con switch
- Stile: gradienti, glass, glow, "max wow"
- Mascotte: **Vladino** 🦇

---

## 🗺 Roadmap (v1)

1. ✅ Setup progetto: frontend PWA + backend PHP `api/`
2. Design system completato (arancio, glass, dark, sidebar)
3. Matematica completa (solver equazioni, frazioni, geometria…)
4. Scienze, Italiano, Storia/Geo, Inglese
5. Studio, Organizzazione, Creatività, Giochi
6. Docenti + contenuti + admin panel
7. AI polza.ai con streaming, mapping modelli, log, rate limit
8. Account, sync, backup, privacy
9. PWA, offline, accessibilità

Vedi `spec.md` per la specifica completa.

---

## 🔒 Sicurezza

- Chiave polza.ai solo lato server (PHP), mai nel browser
- Password hashate con `password_hash()` (bcrypt/argon2)
- `.env` fuori dal repository e protetto da `.htaccess`
- CORS allowlist, rate limit, prepared statements, HTTPS

---

**VladSchool** — costruito per la scuola, senza abbonamenti, senza paywall, senza pubblicità.
