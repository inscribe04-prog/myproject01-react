# MyProject01 — Frontend

> React.js client for MyProject01. Built with Vite, Bootstrap 5, and a schema-driven architecture.

## Live Demo
🚀 [myproject01-production.up.railway.app](https://myproject01-production.up.railway.app)

> Frontend is served directly from the Express backend — no separate deployment needed.

## Tech Stack
- **Framework:** React.js 18
- **Build Tool:** Vite
- **Styling:** Bootstrap 5
- **Routing:** React Router DOM
- **Notifications:** React Toastify
- **HTTP:** Fetch API with credentials

## Project Structure
```
myproject01-react/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx        # Glass morphism login UI
│   │   ├── RegisterPage.jsx     # Registration with live validation
│   │   ├── FormPage.jsx         # Dashboard with collapsible sidebar
│   │   ├── AdminPage.jsx        # User management (admin only)
│   │   └── NotFoundPage.jsx     # 404 page
│   ├── components/
│   │   ├── Navbar.jsx           # Top nav with user info, admin link, logout
│   │   ├── EntryForm.jsx        # 11-field form with validation + counters
│   │   ├── EntriesTable.jsx     # Sortable, searchable, paginated table
│   │   ├── EditModal.jsx        # Edit with dirty check + unsaved warning
│   │   └── ImportExcel.jsx      # Excel bulk import with validation feedback
│   ├── hooks/
│   │   └── useEntryForm.js      # Custom hook — shared form logic
│   ├── schema.js                # Single source of truth for all field definitions
│   ├── validators.js            # Schema-driven validation
│   ├── api.js                   # All fetch calls in one place
│   ├── fetchClient.js           # Base URL + credentials wrapper
│   ├── utils.js                 # Email + password validators
│   └── App.jsx                  # Routing + auth guard
├── public/
├── vite.config.js               # Dev proxy config
└── package.json
```

## Key Features

### Authentication
- Glass morphism login and register pages
- Live email and password validation on blur
- Auth guard — protected routes redirect to login if not logged in
- Admin-only routes redirect non-admins to form page

### Form Page (Dashboard)
- Collapsible dark sidebar — expands on hover
- **Add Entry** — 11-field form with:
  - Live character counters
  - Real-time field validation
  - Conditional fields (guardian shown if age < 18, spouse if married)
  - Password strength indicator + confirm match
  - Auto-dismissing success/error messages
- **View Entries** — data table with:
  - Sort by any column (click header)
  - Search across all fields
  - Pagination (10 per page) with entry count
  - Edit with unsaved changes detection
  - Delete with toast confirmation
- **Import Excel** — bulk upload with server-side validation

### Admin Panel
- View all registered users
- Toggle admin status (with confirmation)
- Delete users
- Current user's buttons disabled to prevent self-lockout

## Architecture Decisions

### Schema-driven
`schema.js` is the single source of truth. Field labels, validation rules, DB column names, and input IDs are all defined once. `validators.js`, `EntriesTable`, `EditModal`, and `EntryForm` all read from schema — no duplication.

### Custom Hook
`useEntryForm` extracts all form state logic (validation, counters, restrictions) into a reusable hook used by both `EntryForm` and `EditModal`.

### API Centralization
All fetch calls go through `api.js` → `fetchClient.js` which handles base URL and credentials in one place.

## Local Development
```bash
git clone https://github.com/inscribe04-prog/myproject01-react.git
cd myproject01-react
npm install
npm run dev
```

Requires backend running at `http://localhost:3000`.

App runs at `http://localhost:5173`

## Building for Production
```bash
npm run build
```

Copy `dist/` folder into backend `Structured/` directory. Express serves it as static files.

## Environment Variables
```
VITE_API_URL=   # Leave empty for same-origin (Railway), set to backend URL for separate deployment
```
