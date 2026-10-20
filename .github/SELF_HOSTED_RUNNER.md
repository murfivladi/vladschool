# 🏗️ Self-Hosted Runner — VladSchool Deploy

Questo documento spiega come configurare il **self-hosted runner** e i **segreti GitHub** necessari per il deploy automatico via FTPS.

---

## 1. Segreti GitHub richiesti

Vai su: **Settings → Secrets and variables → Actions** del repository e aggiungi:

| Segreto | Descrizione | Esempio |
|---------|-------------|---------|
| `FTP_SSL` | Attiva/disattiva FTPS (`true` = SSL/TLS attivo) | `true` |
| `FTP_HOST` | Hostname del server FTP | `ftp.vladinc.ru` |
| `FTP_USER` | Username FTP | `vladschool_user` |
| `FTP_PASS` | Password FTP | `la_tua_password` |
| `FTP_DIR` | Cartella remota di destinazione | `/httpdocs/school` |

> ⚠️ Il file `.env` del backend PHP (con DB e chiavi API) **non** va nel repository: resta sul server FTP, fuori dal repo.

---

## 2. Self-hosted runner

Il workflow gira su `runs-on: self-hosted`. Devi configurare un runner su una macchina che abbia accesso al server FTP (es. un VPS o un server in loco).

### Aggiungi il runner

1. Nella repo GitHub: **Settings → Actions → Runners → New self-hosted runner**
2. Scegli **Linux** (o il tuo OS) e copia i comandi di installazione.
3. Esegui i comandi sulla macchina che farà il deploy.
4. Assegna etichette utili (es. `self-hosted`, `linux`, `deploy`) se vuoi vincolare il workflow a runner specifici.

### Requisiti sulla macchina del runner

- **Git** (per il checkout)
- **Node.js ≥ 20** + **npm** (per il build del frontend)
- Accesso di rete al server FTP/FTPS su `FTP_HOST`

---

## 3. Come funziona il workflow

File: `.github/workflows/deploy.yml`

1. **Trigger**: push su `main` oppure dispatch manuale (`workflow_dispatch`).
2. **Checkout**: scarica il codice sul self-hosted runner.
3. **Build**: se esiste `package.json`, esegue `npm ci` e `npm run build`.
4. **Deploy FTPS**: carica i file via FTP over SSL/TLS su `FTP_DIR` usando `FTP_USER` / `FTP_PASS`.

### File esclusi dal deploy

`.git/`, `.github/`, `node_modules/`, `.env`, `*.md`, `.gitignore`, `.npmrc`, `package-lock.json` non vengono caricati sul server.

---

## 4. Struttura attesa sul server

Dopo il deploy, la cartella `FTP_DIR` conterrà:

```
FTP_DIR/
├── api/              ← backend PHP (index.php, src/, admin/, .htaccess…)
├── dist/             ← build del frontend PWA (se presente)
├── index.html        ← entry point frontend
└── ...               ← altri asset statici
```

Il `.env` del backend deve già esistere su FTP (non viene sovrascritto dal workflow).

---

## 5. Troubleshooting

- **Errore di connessione FTP**: verifica `FTP_HOST`, `FTP_USER`, `FTP_PASS` e che il runner raggiunga il server sulla porta FTPS (solitamente 21 o 990).
- **Permessi negati**: l'utente FTP deve avere scrittura su `FTP_DIR`.
- **Build fallito**: assicurati che `package.json` abbia uno script `build` e che Node.js 20 sia installato sul runner.
