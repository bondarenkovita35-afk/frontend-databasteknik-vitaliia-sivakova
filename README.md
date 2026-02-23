# Frontend – Databasteknik (React)

Minimal React-frontend (Vite) som anropar backend-API:et (Minimal API) för att visa att frontend interagerar med databasen via API.

## Krav
- Node.js 18+ (rekommenderat 20+)
- Backend körs lokalt

## Starta
```bash
npm install
npm run dev
```

Öppna Vite-urlen som visas i terminalen (oftast http://localhost:5173).

## Backend-URL
Frontend använder `VITE_API_BASE` (default: `http://localhost:7000`).

Om din backend kör på annan port:
```bash
# PowerShell
$env:VITE_API_BASE="http://localhost:7000"
npm run dev
```

## Funktioner
- Lista kurser (GET /api/courses)
- Skapa kurs (POST /api/courses)
- Hämta kurs via id (GET /api/courses/{id})
- Ta bort kurs (DELETE /api/courses/{id})

(Valfritt) Deltagare:
- Lista deltagare (GET /api/participants)
- Skapa deltagare (POST /api/participants)
- Ta bort deltagare (DELETE /api/participants/{id})
