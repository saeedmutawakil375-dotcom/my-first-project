# Current Chronicle

Current Chronicle is a full-stack editorial publishing platform built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, and JWT authentication.

## Folder Structure

```text
current-chronicle/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    server.js
  frontend/
    public/
    src/
      components/
      context/
      pages/
```

## Git Bash Setup Commands

```bash
mkdir current-chronicle && cd current-chronicle
git init

mkdir -p backend/{controllers,models,routes,config,middleware}
mkdir -p frontend/src/{components,pages,context}

cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken mongodb-memory-server
npm install -D nodemon

cd ..
npm create vite@latest frontend
# Select: React

cd frontend
npm install
npm install axios react-router-dom tailwindcss
npm install -D postcss autoprefixer @vitejs/plugin-react
npx tailwindcss init -p
```

## Push To GitHub

Create a GitHub repository named `current-chronicle`, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/current-chronicle.git
git branch -M main
git push -u origin main
```

## Backend Run Commands

```bash
cd backend
npm run dev
```

## Seed Demo Content

Run this once after your database is connected to create viewer-ready articles, commentary, and demo authors:

```bash
cd backend
npm run seed
```

## Frontend Run Commands

```bash
cd frontend
npm run dev
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://your-username:your-password@your-cluster-host/current-chronicle?ssl=true&replicaSet=your-replica-set&authSource=admin&appName=CurrentChronicle
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URLS=http://localhost:5173
USE_MEMORY_DB=false
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Example API Response

`GET /api/articles`

```json
[
  {
    "_id": "66fabc1234567890abc12345",
    "category": "Technology",
    "title": "Inside the pressure reshaping independent tech careers",
    "excerpt": "Freelancers and solo founders are rebuilding their playbooks as project pipelines narrow and expectations climb.",
    "description": "Independent tech workers are adapting to a market that now demands deeper specialization...",
    "featuredImage": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    "author": {
      "_id": "66fabc1234567890abc11111",
      "name": "Saeed",
      "email": "saeed@example.com",
      "bio": "Editor covering technology, creator economy shifts, and internet culture."
    },
    "createdAt": "2026-03-19T10:15:00.000Z",
    "updatedAt": "2026-03-19T10:15:00.000Z"
  }
]
```

## Example User Flow

1. Register with a name, email, and password.
2. Sign in to receive a JWT and enter the newsroom.
3. Publish a new article from the newsroom.
4. Open the article details page and add a reader comment.
5. Other signed-in users can recommend strong commentary.

## Preview On Devices

- Open the frontend at `http://localhost:5173` in your browser.
- Open Chrome DevTools with `F12` or `Ctrl + Shift + I`.
- Click the device toolbar icon to test mobile sizes like iPhone SE, Pixel 7, and iPad.
- Test common widths such as `375px`, `768px`, and `1440px`.

## Deployment

### Free Deploy On Render With One Service

- Ignore Blueprint. Use a manual `Web Service` on the free plan.
- The repo already includes [render.yaml](/C:/Users/saeed/my-website/current-chronicle/render.yaml), but you can also enter these settings manually:
  Name: `current-chronicle`
  Branch: `main`
  Runtime: `Node`
  Root Directory: leave empty
  Build Command: `cd backend && npm install && cd ../frontend && npm install && npm run build`
  Start Command: `cd backend && npm start`
- Add these environment variables in Render:
  `MONGO_URI`
  `JWT_SECRET`
  `CLIENT_URLS=https://your-render-service.onrender.com`
  `USE_MEMORY_DB=false`
- Optional but recommended health path: `/health`
- This deployment path serves the React frontend from Express, so you only need one Render service and one public URL.
- After the service is live, run `npm run seed` in `backend` against the same production MongoDB to add viewer content.

## Content For Viewers

The seed script creates:

- 3 contributor accounts with author bios
- 4 editorial-style sample articles across multiple sections
- prewritten reader commentary with recommendation counts
- a demo sign-in you can use for QA and first-look previews

Demo account after seeding:

```text
maya@chronicle.com
Password123!
```

## Example UI Layout

- Front page: lead story, briefing rail, editorial feature grid, and commentary highlights.
- Sign in/Register: editorial membership screens with newsroom framing.
- Newsroom: article publishing desk with headline and long-form body fields.
- Article details: long-form article presentation with reader comments and recommend buttons.
