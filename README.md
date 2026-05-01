# 🔮 MORGANA — Oracolo dei Tarocchi

## AVVIO RAPIDO (3 passi)

### 1. Installa Node.js
Vai su https://nodejs.org → scarica versione **LTS** → installa

### 2. Configura la API Key
```bash
# Nella cartella morgana-node:
cp .env.example .env
```
Apri `.env` e inserisci la tua chiave Anthropic (https://console.anthropic.com):
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Avvia
```bash
cd morgana-node
npm install
npm start
```
Apri **http://localhost:3000** nel browser ✅

---

## TEST SUL TELEFONO
1. Computer e telefono sulla **stessa rete WiFi**
2. Trova il tuo IP:
   - Windows: `ipconfig` → "Indirizzo IPv4"
   - Mac/Linux: `ifconfig | grep "inet "`
3. Apri `http://192.168.X.X:3000` sul telefono
4. Chrome → menu ⋮ → **"Aggiungi a schermata Home"** → app installata!

---

## PUBBLICAZIONE ONLINE (Railway — gratis)
1. Vai su https://railway.app → crea account con GitHub
2. Carica questa cartella su GitHub
3. Railway → **New Project** → **Deploy from GitHub**
4. Aggiungi variabile: `ANTHROPIC_API_KEY=sk-ant-...`
5. Ottieni URL pubblico tipo `https://morgana.up.railway.app`

---

## GOOGLE PLAY STORE (TWA)
```bash
npm install -g @bubblewrap/cli
mkdir morgana-android && cd morgana-android
bubblewrap init --manifest https://TUO_URL/manifest.json
bubblewrap build
```
Carica l'APK su https://play.google.com/console ($25 una tantum)

---

## STRUTTURA
```
morgana-node/
├── server.js          ← Server Node.js + proxy API Anthropic
├── package.json
├── .env.example       ← Copia in .env e inserisci la chiave
└── public/
    ├── index.html     ← App completa
    ├── manifest.json  ← PWA config
    ├── sw.js          ← Service Worker (offline)
    ├── icons/         ← Icone app
    └── .well-known/   ← Per Google Play TWA
```
