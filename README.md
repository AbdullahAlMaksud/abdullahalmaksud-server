# Abdullah Al Maksud Server

To install dependencies:

```bash
bun install
```

To run in development:

```bash
bun run dev
```

To run normally:

```bash
bun run start
```

## Environment

`.env` is already created for local development.

```env
HOST=0.0.0.0
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abdullahalmaksud
MONGODB_DB_NAME=abdullahalmaksud
REQUIRE_DATABASE_CONNECTION=false
BETTER_AUTH_SECRET=replace-with-at-least-32-random-characters
BETTER_AUTH_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAILS=abdullah@example.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Use your MongoDB Atlas URI in `MONGODB_URI`. Keep the real URI only in `.env` or Render environment variables.

In development, `REQUIRE_DATABASE_CONNECTION=false` lets the API start even if
Atlas is not reachable. Auth and session-backed routes still need MongoDB. In
production, the server requires MongoDB by default.

## Render Deploy

Render settings:

- Runtime: `Node`
- Build Command: `bun install --frozen-lockfile`
- Start Command: `bun run start`
- Health Check Path: `/health`

Environment variables on Render:

```env
NODE_ENV=production
HOST=0.0.0.0
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abdullahalmaksud
MONGODB_DB_NAME=abdullahalmaksud
BETTER_AUTH_SECRET=generate-a-long-random-secret
BETTER_AUTH_URL=https://your-render-service.onrender.com
CORS_ORIGIN=https://your-frontend-domain.com,http://localhost:3000
ADMIN_EMAILS=your-admin-email@example.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://api.your-backend-domain.com/api/auth/callback/google
COOKIE_DOMAIN=.your-root-domain.com
```

This repo also includes `render.yaml`, so you can create the Render service from a Blueprint and fill the secret values in the Render dashboard.

For Google login, add this exact Authorized redirect URI in Google Cloud Console:

```text
https://api.abdullahalmaksud.com/api/auth/callback/google
```

If you want the Google callback URL to use the frontend domain instead, set:

```env
GOOGLE_REDIRECT_URI=https://abdullahalmaksud.com/api/auth/callback/google
COOKIE_DOMAIN=.abdullahalmaksud.com
```

Then add this exact URI to Google Cloud Console:

```text
https://abdullahalmaksud.com/api/auth/callback/google
```

Your frontend must proxy or rewrite `/api/auth/*` to this backend API, otherwise
Google will redirect to the frontend but Better Auth will not receive the
callback.

If you have Docker installed, you can start a local MongoDB with:

```bash
docker compose up -d
```

Then use this local URI in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/abdullahalmaksud
```

## Main Endpoints

- `GET /` - API status
- `GET /health` - server and MongoDB/Mongoose connection status
- `GET /api/health` - same health endpoint under the API prefix
- `GET /api/me` - current logged-in user/session
- `GET /api/v1/site?locale=en` - localized site configuration
- `GET /api/v1/content?locale=en` - localized projects, blog posts, and books
- `GET /api/v1/dashboard?locale=en` - admin-only dashboard data
- `POST /api/auth/sign-up/email` - Better Auth email signup
- `POST /api/auth/sign-in/email` - Better Auth email signin
- `GET /api/auth/get-session` - Better Auth session check
- `POST /api/auth/sign-out` - Better Auth signout

Users are created with the `user` role by default. Any email listed in
`ADMIN_EMAILS` is promoted to `admin` when the account is created or when that
user has an active session.

## Test With Curl

Sign up:

```bash
curl -i -X POST http://localhost:4000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Abdullah","email":"abdullah@example.com","password":"password123"}'
```

Sign in:

```bash
curl -i -X POST http://localhost:4000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"abdullah@example.com","password":"password123"}'
```

## Frontend Better Auth Client

Install Better Auth in your frontend, then point the client to this server:

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000",
});
```

When calling from the browser, keep credentials/cookies enabled. The server currently allows `http://localhost:3000` through `CORS_ORIGIN`.
