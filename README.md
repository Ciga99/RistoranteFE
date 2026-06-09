# Ristorante — Sito Web

Sito web per ristorante con alloggio, sviluppato con React, TypeScript e Vite.
Include area pubblica per i clienti e pannello di amministrazione protetto da login.

---

## Stack tecnologico

| Tecnologia | Versione |
|---|---|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 7 |
| Tailwind CSS | 4 |
| React Router | 7 |
| Axios | 1.13 |
| Lucide React | 0.575 |

---

## Funzionalità

### Area pubblica
- **Home** — Hero, storia del ristorante, orari di apertura dinamici, sezione menu, alloggio, mappa Google, footer con contatti
- **Menu** — Menu alla carta e menu speciale del giorno caricati da API, con switch tra i due
- **Camere** — Lista delle stanze disponibili con schede dettaglio
- **Privacy Policy** — Informativa GDPR completa
- **Cookie Banner** — Consenso cookie con localStorage

### Area amministrativa (`/admin`)
- Login con autenticazione JWT
- Gestione menu: CRUD piatti e categorie
- Gestione camere
- Gestione orari di apertura e giorni speciali

---

## Avvio locale

```bash
npm install
npm run dev
```

Il frontend si connette al backend tramite la variabile `VITE_API_URL`.

### Variabili d'ambiente

Crea un file `.env.local` nella root del progetto:

```
VITE_API_URL=http://localhost:8000/
```

Per la produzione è già presente `.env.production` con l'URL del server live.

---

## Script disponibili

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Compila TypeScript e genera il bundle di produzione |
| `npm run preview` | Anteprima del build di produzione in locale |
| `npm run lint` | Controlla il codice con ESLint |

---

## Struttura del progetto

```
src/
├── components/          # Componenti riutilizzabili (NavBar, Hero, RoomCard, ...)
├── pages/
│   ├── home/            # Pagina principale
│   ├── admin/           # Pannello amministrativo
│   ├── menu.tsx
│   ├── rooms.tsx
│   ├── login.tsx
│   └── PrivacyPolicy.tsx
├── hooks/               # Hook personalizzati (useAuth, ...)
├── services/            # Configurazione Axios (api.ts)
└── types/               # Tipi TypeScript condivisi
```

---

