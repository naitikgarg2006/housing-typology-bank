# Housing Typology Bank (HTB)

Real-time access to housing typology information for house construction across Indian regions.

---

## Prerequisites

Make sure you have the following installed on your machine before running this project:

| Software | Version  | Download Link                        |
|----------|----------|--------------------------------------|
| Node.js  | v18+     | https://nodejs.org/                  |
| npm      | v9+      | (comes with Node.js)                 |

To verify, open a terminal and run:

```bash
node -v
npm -v
```

---

## How to Run (Step-by-Step)

### Step 1: Unzip the project

Unzip `housing-typology-bank.zip` to any folder on your computer.

### Step 2: Open two terminals

You need **two** terminal windows — one for the backend, one for the frontend.

### Step 3: Configure MongoDB

In **Terminal 1**, navigate to the backend folder, add your MongoDB URI to `backend/.env`, and install packages:

```bash
cd housing-typology-bank/backend
npm install
```

Use this database name in `backend/.env`:

```env
MONGODB_DB_NAME=app-house
```

### Step 4: Start the backend server

In the **same Terminal 1**, start the backend:

```bash
npm start
```

You should see:

```
Server running on port 5001
```

> Keep this terminal open and running.

### Step 5: Install frontend dependencies

In **Terminal 2**, navigate to the frontend folder and install packages:

```bash
cd housing-typology-bank/frontend
npm install
```

### Step 6: Start the frontend

In the **same Terminal 2**, start the frontend dev server:

```bash
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Step 7: Open in browser

Open your browser and go to:

```
http://localhost:3000
```

---

## Authentication

- Better Auth powers email/password authentication with secure session cookies.
- Create a user from the registration page to sign in.
- To promote a registered user to admin, run:

```bash
cd housing-typology-bank/backend
npm run make:admin -- your-email@example.com
```

- After promoting a user, sign out and sign back in so the new role is reflected in the session.
- A fresh `app-house` database starts empty unless you add users and typologies yourself.

---

## Pages & Features

### Page 1 — Login & Registration
- Better Auth email/password login and registration
- Role-based access (User vs Admin)
- Session-based auth with HTTP cookies

### Page 2 — Interactive Map Dashboard (Home)
- Full-screen map with markers for 15 locations across India
- Click any marker to see a preview, then click "View Full Details"
- Falls back to a card grid if the map fails to load

### Page 3 — Typology Search & Filter
- Filter by **Material** (Bamboo, Stone, Mud, etc.)
- Filter by **Climate Type** (Arid, Tropical, Cold, etc.)
- Filter by **Construction Style** (RCC Frame, Stilted, Load Bearing, etc.)
- Full-text search by name, region, or description

### Page 4 — Housing Detail View
- Hero image with gallery
- Full technical specifications (foundation, roof, wall thickness, steel/concrete grades)
- **Suitability section** — explains why this design works for local hazards
- **Hazard resistance badges** (Earthquake, Flood, Cyclone, etc.)
- **Feedback form** — star rating + comments

### Page 5 — Admin Control Panel (Admin only)
- Dashboard stats: total typologies, feedback, users, average rating
- Bar charts showing distribution by climate type and material
- Full CRUD table — add, edit, delete typologies
- Feedback moderation — view and delete feedback

---

## Tech Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, React Router, Mapbox GL JS, Lucide Icons |
| Backend   | Node.js, Express                          |
| Auth      | Better Auth                               |
| Database  | MongoDB Atlas (`app-house`) |

---

## Project Structure

```
housing-typology-bank/
├── backend/
│   ├── middleware/
│   │   └── auth.js        # Better Auth session + admin middleware
│   ├── routes/
│   │   ├── typologies.js  # CRUD + search/filter for typologies
│   │   ├── feedback.js    # User feedback endpoints
│   │   └── analytics.js   # Admin analytics/stats
│   ├── scripts/
│   │   ├── import-typologies.js # Import dataset into MongoDB
│   │   └── make-admin.js  # Promote a Better Auth user to admin
│   ├── betterAuth.js      # Better Auth server setup
│   ├── db.js              # MongoDB connection helper
│   ├── models/            # Mongoose models
│   ├── seed.js            # Clears all MongoDB app data
│   ├── server.js          # Express app entry point
│   ├── package.json
│   └── .env               # Environment config (Better Auth secret, port, Mongo URI)
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # Sidebar + navigation shell
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── lib/
│   │   │   └── auth-client.js    # Better Auth React client
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Login & registration
│   │   │   ├── MapDashboard.jsx  # Interactive map (home)
│   │   │   ├── SearchFilter.jsx  # Search & filter page
│   │   │   ├── TypologyDetail.jsx# Detail view + feedback
│   │   │   └── AdminPanel.jsx    # Admin CRUD + analytics
│   │   ├── utils/
│   │   │   └── api.js            # Axios API client
│   │   ├── App.jsx               # Router setup
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint                  | Auth     | Description                    |
|--------|---------------------------|----------|--------------------------------|
| POST   | /api/auth/sign-up/email   | No       | Register a new user            |
| POST   | /api/auth/sign-in/email   | No       | Sign in with email/password    |
| POST   | /api/auth/sign-out        | User     | Clear the current session      |
| GET    | /api/auth/get-session     | User     | Get current user session       |
| GET    | /api/typologies           | No       | List all (with filters)        |
| GET    | /api/typologies/markers   | No       | Map markers (id, name, lat/lng)|
| GET    | /api/typologies/filters   | No       | Available filter options       |
| GET    | /api/typologies/:id       | No       | Single typology details        |
| POST   | /api/typologies           | Admin    | Create new typology            |
| PUT    | /api/typologies/:id       | Admin    | Update typology                |
| DELETE | /api/typologies/:id       | Admin    | Delete typology                |
| GET    | /api/feedback/:typologyId | No       | Feedback for a typology        |
| POST   | /api/feedback             | User     | Submit feedback                |
| GET    | /api/feedback             | Admin    | All feedback                   |
| DELETE | /api/feedback/:id         | Admin    | Delete feedback                |
| GET    | /api/analytics/stats      | Admin    | Dashboard statistics           |

---

## Troubleshooting

| Problem                          | Solution                                                        |
|----------------------------------|-----------------------------------------------------------------|
| `npm install` fails              | Make sure Node.js v18+ is installed. Delete `node_modules` and retry. |
| Port 5001 already in use         | Change `PORT` in `backend/.env` to another port (e.g. 5002).   |
| Port 3000 already in use         | Change port in `frontend/vite.config.js` under `server.port`.  |
| Map not loading                  | The map uses a public Mapbox token. Ensure internet connectivity. Falls back to card view on failure. |
| Atlas database not visible       | Make sure `MONGODB_URI` is valid and the database name is `app-house`. MongoDB creates the DB after a successful write. |
| Want to empty the database       | Run `cd backend && npm run seed`. You will be asked to confirm (y/N) before any data is deleted. |
| Login not working                | Make sure the backend can connect to MongoDB and that your user exists in `app-house.users`. |
| Backend API errors in browser    | Ensure the backend is running on port 5001 before starting frontend. |

---

## Stopping the Servers

Press `Ctrl + C` in each terminal window to stop the backend and frontend servers.
