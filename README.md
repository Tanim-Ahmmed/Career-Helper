#Career Helper

Career Helper is a full-stack SaaS-style career platform built with Next.js, Express, MongoDB, JWT auth, and Gemini-powered AI tools. The project includes a public marketing site, authenticated user dashboard flows, and an admin workspace.

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Zustand, TanStack Query, Framer Motion, GSAP, Lenis
- Backend: Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Cloudinary
- AI: Gemini API
- Workspace: pnpm workspaces

## Project Structure

- `frontend/`: Next.js application
- `backend/`: Express API
- `instructions.md`: build roadmap and milestone instructions

## Environment Setup

Create environment files for the frontend and backend before starting the app.

### Backend environment variables

Required for normal backend runtime:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017
ACCESS_TOKEN_SECRET=your-jwt-secret
ACCESS_TOKEN_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
GEMINI_API_KEY=your-gemini-key
```

Required for admin seeding:

```env
ADMIN_NAME=Platform Admin
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
ADMIN_PROFESSION=Platform Admin
```

`ADMIN_PROFESSION` is optional. If omitted, the seed script uses `Platform Admin`.

### Frontend environment variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Install And Run

Install dependencies from the repo root:

```bash
pnpm install
```

Start both apps in development:

```bash
pnpm dev
```

Start the apps separately if needed:

```bash
pnpm --filter frontend dev
pnpm --filter backend dev
```

## Build And Lint

Run the workspace build:

```bash
pnpm build
```

Run lint checks:

```bash
pnpm lint
```

## Admin Seed Setup

Create the backend admin env values, then run:

```bash
pnpm --filter backend seed:admin
```

What the seed script does:

- creates the admin if no matching user exists
- updates an existing matching user to `role: admin`
- normalizes email and username to lowercase
- re-hashes the provided password before saving

The script is safe to run multiple times. Re-running it updates the same matching account instead of creating duplicates.

## Admin Login

After seeding:

1. Start the frontend and backend.
2. Open `/login`.
3. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
4. Admin users are redirected to `/admin`.

Regular users continue to land on `/user`.

## Auth And Toast Behavior

- JWT authentication is handled by the backend API.
- Frontend auth state is stored client-side for the current session experience.
- Toast feedback is used for login, registration, logout, profile updates, and AI generation flows.
- Field-level validation still appears inline through React Hook Form and Zod.
- Future delete actions should reuse the same shared API error-to-toast helper for consistent feedback.

## Daily Commands

- `pnpm dev`: run frontend and backend together
- `pnpm build`: run production builds
- `pnpm lint`: run linting across both apps
- `pnpm --filter backend seed:admin`: seed or update the admin account

## Troubleshooting

### Missing environment variables

If the backend exits immediately, confirm all required backend env vars are set. The app and seed script fail fast when required values are missing.

### MongoDB connection issues

If the backend or seed command cannot connect, verify:

- `MONGODB_URI` is correct
- MongoDB is running
- your IP or network access is allowed by the database host

### Gemini failures

If AI actions fail:

- confirm `GEMINI_API_KEY` is valid
- make sure the backend is running
- check backend logs for upstream Gemini errors

### Frontend cannot reach the API

If login or dashboard requests fail:

- confirm `NEXT_PUBLIC_API_URL` points to the backend `api/v1` base URL
- confirm `CLIENT_URL` matches your frontend origin
- make sure both frontend and backend are running on the expected ports
