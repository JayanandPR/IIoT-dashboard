# IIoT Machine Monitoring Dashboard

A simplified monitoring dashboard for a factory floor. Machines report temperature, vibration, and operating status (`running`, `idle`, `fault`). A plant supervisor can see machine health at a glance, search and filter machines, open a machine's details, and acknowledge faults.

- **Backend:** Node.js + Express REST API (in-memory data, seeded from `machines.json`)
- **Frontend:** React (Vite) + Redux Toolkit + React Redux + Axios, styled with plain CSS

---

## Project structure

```
consyst-test/
├── backend/
│   ├── server.js                     # Express app: CORS, JSON parsing, routes, 404 + error handlers
│   ├── routes/machineRoutes.js       # URL + method → controller function
│   ├── controllers/machineController.js  # Endpoint logic and PATCH validation
│   └── data/machines.json            # Seed data (the 4 machines from the assessment)
│
└── frontend/
    └── src/
        ├── main.jsx                  # Wraps the app in the Redux <Provider>
        ├── App.jsx
        ├── index.css                 # All styles (responsive, plain CSS)
        ├── store/
        │   ├── store.js              # configureStore
        │   └── machineSlice.js       # createSlice + createAsyncThunk API calls
        └── components/
            ├── Dashboard.jsx         # Page: fetches on load, search/filter, opens detail
            ├── SummaryCards.jsx      # Total / Running / Idle / Fault counts
            ├── FilterBar.jsx         # Name search + status filter
            ├── MachineCard.jsx       # One machine in the grid
            ├── StatusBadge.jsx       # Colour-coded status label
            └── MachineDetail.jsx     # Detail side panel + Acknowledge Fault button
```

---

## Setup and run

**Prerequisite:** Node.js 20.19+ or 22.12+ (tested on Node 24). Vite requires one of these versions.

Run the backend and the frontend in **two separate terminals**.

### 1. Backend (port 5000)

```bash
cd backend
npm install
npm start          # or: npm run dev   (auto-restarts on file changes)
```

Expected output: `Server running on http://localhost:5000`

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> The frontend calls the API at `http://localhost:5000/api/machines`. If you run the backend on another port (`PORT=5001 npm start`), update `API_URL` at the top of `frontend/src/store/machineSlice.js`.

---

## API reference

Base URL: `http://localhost:5000/api/machines`

| Method | Route                      | Description                     | Success               | Errors                                                           |
| ------ | -------------------------- | ------------------------------- | --------------------- | ---------------------------------------------------------------- |
| GET    | `/api/machines`            | Return all machines             | `200` array           | –                                                                |
| GET    | `/api/machines/:id`        | Return one machine              | `200` object          | `404` unknown id                                                 |
| PATCH  | `/api/machines/:id/status` | Update status and `lastUpdated` | `200` updated machine | `400` missing/invalid status or malformed JSON, `404` unknown id |

**PATCH body** (`Content-Type: application/json`):

```json
{ "status": "idle" }
```

`status` must be one of `running`, `idle`, `fault`. All errors are returned as JSON, e.g.:

```json
{ "error": "Invalid status 'broken'. Allowed values: running, idle, fault" }
```

Unknown routes return `404` JSON. CORS is enabled for all origins.

**Note:** data is stored in memory, so every server restart resets it to the seed data.

---

## Frontend features

- **Dashboard** with summary cards (total, running, idle, fault) and a responsive grid of machine cards showing name, ID, status, temperature, and vibration.
- **Colour-coded status:** green = running, yellow = idle, red = fault.
- **Fetch on load** through a Redux async thunk. The UI shows a loading message, or an error box with a Retry button if the API can't be reached.
- **Search** by machine name (case-insensitive) and **filter** by status (All / Running / Idle / Fault buttons). The two can be combined.
- **Detail side panel:** clicking a card opens a panel from the right with the machine's full details, including its last-updated time.
- **Acknowledge Fault:** the button appears only when status is `fault`. It dispatches a Redux thunk that sends `PATCH { status: "idle" }`. The store, the card, the panel, and the summary counts all update from the server's response. The button is disabled while the request is in progress, and any API error is shown in the panel.
- **Responsive layout:** the summary cards become a 2×2 grid on tablets, the filter bar stacks, and the detail panel goes full-width on phones.

---

## Architecture and implementation notes

**Backend.** The code is split into three layers: `server.js` (middleware and error handling), `routes/` (URL mapping), and `controllers/` (logic). The seed JSON is loaded into memory once at startup. PATCH validation checks that the machine exists (`404`), then that `status` is present and allowed (`400`). It then updates `status` and `lastUpdated` (ISO timestamp) and returns the updated machine. A final error handler turns malformed JSON bodies into a `400` JSON response instead of Express's default HTML page.

**Frontend data flow (Redux Toolkit).**

```
Dashboard mounts ──dispatch(fetchMachines)──► GET /api/machines
                                               │
       pending → loading=true                  │
       fulfilled → items = response ◄──────────┘
       rejected → error = message

"Acknowledge Fault" ──dispatch(acknowledgeFault(id))──► PATCH /api/machines/:id/status
       pending → acknowledgingId = id (button disabled)
       fulfilled → replace that machine in items with the server's response
       rejected → acknowledgeError = message
```

- All machine data and request states live in the Redux `machines` slice. Components read from it with `useSelector` and change it only by dispatching actions.
- Component state (`useState`) is used only for UI concerns: the search text, the selected status filter, and which machine's detail panel is open.
- The detail panel reads its machine from the store by ID rather than receiving a copy as a prop, so it updates immediately after an acknowledgement.
- The store is updated when the server responds, not optimistically. This keeps the UI consistent with the server, and the API responds fast enough locally that this is not noticeable.

---

## Testing performed

- **Backend:** all endpoints were tested with curl/Postman, including success cases, an unknown machine ID (`404`), an invalid or missing status (`400`), a malformed JSON body (`400`), an unknown route (`404`), and the CORS headers, including the CORS preflight check browsers send before a `PATCH` request.
- **Frontend:** lint and production build pass. The Redux slice was run against the live backend to check the loading → loaded states, the acknowledge flow (store and server both show `idle`), the API error message for an unknown machine, and the error state when the backend is offline.

---

## AI assistance

AI-assisted coding (Claude Code) was used for this test, as permitted by the assessment, to help scaffold, write, and test the code. All code was reviewed and run locally.

---

## What I would improve with more time

1. Simulate live sensor updates (polling or WebSockets) so temperature, vibration, and status change every few seconds, as the scenario describes.
2. Persist data in a database (e.g. MongoDB) instead of memory, and keep a history of faults and acknowledgements (who acknowledged, and when).
3. Add automated tests: Jest + Supertest for the API, and React Testing Library for the components and the Redux slice.
4. Add threshold alerts that highlight machines whose temperature or vibration exceeds safe limits, and move the API URL into a `.env` file.
