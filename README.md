# Auréa – Frontend

Vue-3-Oberfläche für **Auréa**, eine Web-App für die eigene Parfümsammlung: Flakons eintragen, Wunschliste führen und jeden Tag einen Duft bekommen, der zum Wetter passt.

**Backend-Repository:** https://github.com/rubyy-ak/aurea-backend

**Live-App:** https://aurea-parfum.onrender.com

## Aufbau

```
src/
  views/       Seiten (Login, Start, Sammlung/Wunschliste, Formular, Detail)
  components/  Eigene Komponenten, u. a. PerfumeList (rendert die Parfüms mit v-for),
               PerfumeCard, PerfumeFilters, StarRating, SuggestionCard
  api.js       Zugriff auf die REST-API des Backends
  validation.js  Eingabeprüfung im Browser
tests/         Vitest-Tests
```

## Lokal starten

Voraussetzung: Node 24. Das Backend muss laufen (Standard: `http://localhost:8080`).

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 36 Tests
```

Die Backend-URL kommt aus der Umgebungsvariablen `VITE_API_URL` (siehe `.env.example`).

## Deployment auf Render

1. Auf Render **New → Blueprint** wählen und dieses Repository auswählen.
2. Die Backend-URL (`VITE_API_URL`) steht bereits in `render.yaml`.

GitHub Actions führt bei jedem Push die Tests und den Build aus. Render deployt erst, wenn sie grün sind.
