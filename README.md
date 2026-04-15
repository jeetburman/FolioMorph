# FolioMorph

> Transform any PDF into a decent, animated flipbook with real page-turn physics, sound, and embeddable sharing.

<!-- ![FolioMorph Architecture](./architecture.png) -->

---

## What It Does

FolioMorph takes a PDF upload and converts it into a fully interactive flipbook with realistic 3D page-flip animations, flip sound effects, and a shareable/embeddable link — all running in the browser.

---


## Current progress of project : 

- [x] PDF upload & processing pipeline
- [x] Ghostscript PDF → PNG conversion
- [x] Supabase Storage integration
- [x] BullMQ async job processing
- [ ] Frontend flipbook viewer (StPageFlip)
- [ ] Flip sound effects (Howler.js)
- [ ] Shareable link & embed code generator
- [ ] Download flipbook as ZIP
- [ ] User authentication (NextAuth.js)
- [ ] User dashboard with saved flipbooks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Page Flip Engine | StPageFlip |
| Flip Sound | Howler.js |
| Backend | Node.js + Express.js + TypeScript |
| PDF → Image | Ghostscript (via `child_process`) |
| Job Queue | BullMQ + Upstash Redis |
| Database | Neon PostgreSQL + Prisma ORM |
| File Storage | Supabase Storage |
| Monorepo | npm Workspaces |
| Deploy: Frontend | Vercel |
| Deploy: Backend | To be decided |

---


## Database Schema

### `Flipbook` table
Stores one record per uploaded PDF.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `slug` | String (unique) | URL-friendly identifier e.g. `my-report-a3f9c1` |
| `title` | String | Name of the flipbook |
| `originalPdfUrl` | String | Supabase URL of the original PDF |
| `pageCount` | Int | Total number of pages |
| `status` | Enum | `PENDING` → `PROCESSING` → `READY` / `FAILED` |
| `createdAt` | DateTime | Upload timestamp |

### `Page` table
Stores one record per page of a flipbook.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `flipbookId` | UUID | Foreign key → `Flipbook.id` |
| `pageNumber` | Int | Page number (1-indexed) |
| `imageUrl` | String | Supabase URL of the PNG image |

### Relationship
```
Flipbook (1) ──────→ Page (many)
```
Deleting a Flipbook cascades and deletes all its Pages.

### Processing Status Flow
```
PENDING → PROCESSING → READY
                     ↘ FAILED
```

---

## API Endpoints

### `POST /api/flipbooks/upload`
### `GET /api/flipbooks/:slug/status`
### `GET /api/flipbooks/:slug`
### `GET /health`

---

## Under the Hood - How Processing Works

1. **Upload** — User uploads a PDF via `multipart/form-data`. Multer saves it to `backend/uploads/` temporarily.
2. **Page Count** — The backend reads the raw PDF buffer with a regex to count `/Type /Page` entries.
3. **DB Record** — A `Flipbook` record is created in Neon Postgres with status `PENDING`.
4. **Original Upload** — The PDF is uploaded to Supabase Storage at `flipbooks/{id}/original.pdf`.
5. **Queue Job** — A BullMQ job is pushed to Upstash Redis with the flipbook ID, local PDF path, and page count.
6. **Worker Picks Up** — The BullMQ worker pulls the job and updates status to `PROCESSING`.
7. **Ghostscript Conversion** — For each page, Ghostscript is called via `child_process.execFile` to render a 1240×1754px PNG at 150 DPI:
   ```
   gswin64c -dNOPAUSE -dBATCH -sDEVICE=png16m -r150
            -dFirstPage=N -dLastPage=N -sOutputFile=page-N.png input.pdf
   ```
8. **PNG Upload** — Each PNG is uploaded to Supabase Storage at `flipbooks/{id}/page-N.png`.
9. **DB Update** — A `Page` record is saved to Neon for each page with its image URL.
10. **Completion** — After all pages are processed, the `Flipbook` status is updated to `READY`. Local temp files are deleted.
11. **Frontend Displays** — The frontend polls `/status` until `READY`, then loads the flipbook viewer with all page image URLs from `GET /:slug`.

---

## Environment Variables

### `backend/.env`
```env
DATABASE_URL=""         # Neon PostgreSQL connection string
REDIS_URL=""            # Upstash Redis URL (rediss://...)
SUPABASE_URL=""         # Supabase project URL
SUPABASE_SERVICE_KEY="" # Supabase service role key
SUPABASE_BUCKET=""      # Supabase storage bucket name
GS_PATH="gswin64c"      # Ghostscript binary path or command
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## If you plan to try this locally : 

### Prerequisites
- Node.js v20+
- npm
- Docker Desktop (for local Redis, optional if using Upstash)
- Ghostscript installed and in PATH

### Setup
```bash
# Clone and install
git clone https://github.com/jeetburman/FolioMorph.git
cd FolioMorph
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Fill in your Neon, Upstash, Supabase credentials

# Run database migrations
cd backend
npx prisma migrate dev

# Start both frontend and backend
cd ..
npm run dev
```

Frontend runs at `http://localhost:3000`
Backend runs at `http://localhost:4000`

---
