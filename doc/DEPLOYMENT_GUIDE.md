# 🚀 Abdullah Al Maksud — Server Deployment Manual

This manual provides comprehensive instructions for deploying the **Abdullah Al Maksud Core API Server** to production environments, including **Vercel Serverless**, **Render**, and **Self-Hosted Docker/VPS**.

---

## 📑 Table of Contents

1. [Environment Variables Matrix](#1-environment-variables-matrix)
2. [Deployment Option A: Vercel Serverless (Recommended)](#2-deployment-option-a-vercel-serverless-recommended)
3. [Deployment Option B: Render Web Service](#3-deployment-option-b-render-web-service)
4. [Deployment Option C: Self-Hosted Docker / VPS](#4-deployment-option-c-self-hosted-docker--vps)
5. [Database Setup & MongoDB Atlas Security](#5-database-setup--mongodb-atlas-security)
6. [Resend Email & Domain Authentication (DNS)](#6-resend-email--domain-authentication-dns)
7. [Vercel Blob Storage Configuration](#7-vercel-blob-storage-configuration)
8. [Post-Deployment Verification Checklist](#8-post-deployment-verification-checklist)
9. [Troubleshooting Common Issues](#9-troubleshooting-common-issues)

---

## 1. Environment Variables Matrix

Before initiating any deployment, gather and configure the following variables in your hosting dashboard:

| Variable Name                 | Type      | Example / Value                                                   | Description                                                              |
| :---------------------------- | :-------- | :---------------------------------------------------------------- | :----------------------------------------------------------------------- |
| `NODE_ENV`                    | `string`  | `production`                                                      | Enables production optimizations, secure cookies, and strict validation. |
| `HOST`                        | `string`  | `0.0.0.0`                                                         | Binding interface for containerized runtimes.                            |
| `PORT`                        | `number`  | `5000`                                                            | Port for local/VPS runtimes (automatically overridden on Vercel).        |
| `MONGODB_URI`                 | `string`  | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0`   | MongoDB Atlas primary connection string.                                 |
| `MONGODB_DB_NAME`             | `string`  | `abdullahalmaksud`                                                | Target database name in the Atlas cluster.                               |
| `REQUIRE_DATABASE_CONNECTION` | `boolean` | `true`                                                            | When `true`, enforces strict DB connection prior to accepting traffic.   |
| `BETTER_AUTH_SECRET`          | `string`  | `min-32-random-alphanumeric-secret-key-here`                      | Cryptographic secret for session signing and hashing.                    |
| `BETTER_AUTH_URL`             | `string`  | `https://api.abdullahalmaksud.com`                                | Public canonical URL of the authentication server.                       |
| `CORS_ORIGIN`                 | `string`  | `https://abdullahalmaksud.com,https://chief.abdullahalmaksud.com` | Comma-separated list of allowed frontend client origins.                 |
| `ADMIN_EMAILS`                | `string`  | `admin@abdullahalmaksud.com,owner@gmail.com`                      | Comma-separated list of emails granted administrative privileges.        |
| `COOKIE_DOMAIN`               | `string`  | `.abdullahalmaksud.com`                                           | Domain scope for session cookies to enable cross-subdomain SSO.          |
| `GOOGLE_CLIENT_ID`            | `string`  | `123456789-abc.apps.googleusercontent.com`                        | (Optional) Google OAuth2 Client ID.                                      |
| `GOOGLE_CLIENT_SECRET`        | `string`  | `GOCSPX-your_google_secret`                                       | (Optional) Google OAuth2 Client Secret.                                  |
| `GOOGLE_REDIRECT_URI`         | `string`  | `https://api.abdullahalmaksud.com/api/auth/callback/google`       | (Optional) Google OAuth2 authorized redirect URI.                        |
| `RESEND_API_KEY`              | `string`  | `re_123456789_abcdef`                                             | Resend API key for transactional email and OTP dispatch.                 |
| `EMAIL_FROM`                  | `string`  | `Abdullah Al Maksud Admin <admin@abdullahalmaksud.com>`           | Verified sender address in Resend.                                       |
| `CONTACT_RECIPIENT_EMAIL`     | `string`  | `contact@abdullahalmaksud.com`                                    | Destination inbox for direct contact inquiry notifications.              |
| `BLOB_READ_WRITE_TOKEN`       | `string`  | `vercel_blob_rw_abcdef123456`                                     | Vercel Blob access token with read/write scopes.                         |

---

## 2. Deployment Option A: Vercel Serverless (Recommended)

The server codebase is natively pre-configured for Vercel with dedicated serverless request adapters and routing definitions.

### Configuration Files Included:

- **`vercel.json`**:
  ```json
  {
    "version": 2,
    "functions": {
      "api/index.ts": {
        "maxDuration": 30
      }
    },
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/api/index"
      }
    ]
  }
  ```
- **`api/index.ts`**: Handles raw body streaming for BetterAuth and routes all requests into Hono's Node listener.

### Deployment Steps:

1. Push your repository to GitHub / GitLab.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the repository and select the **Root Directory** as `AbdullahAlMaksudServer`.
4. Under **Build and Output Settings**:
   - Framework Preset: **Other**
   - Build Command: `pnpm build` (or leave default)
   - Install Command: `pnpm install`
5. Under **Environment Variables**, paste all entries from the Environment Variables Matrix above.
6. Click **Deploy**.
7. Navigate to **Project Settings > Domains** and attach your custom API domain (e.g. `api.abdullahalmaksud.com`).
8. Add the CNAME record in your DNS provider:
   ```
   CNAME  api  cname.vercel-dns.com
   ```

---

## 3. Deployment Option B: Render Web Service

The repository includes a ready-to-use **`render.yaml`** configuration for persistent Node.js hosting.

### Deployment Steps:

1. Connect your repository to [Render](https://render.com/).
2. Select **Blueprints** and point Render to `AbdullahAlMaksudServer/render.yaml`.
3. Set the required sensitive environment variables (`MONGODB_URI`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, etc.) in the Render dashboard.
4. Render executes:
   - Build Command: `npm install -g pnpm && pnpm install --frozen-lockfile`
   - Start Command: `pnpm start`
   - Health Check Path: `/health`

---

## 4. Deployment Option C: Self-Hosted Docker / VPS

For self-hosting on Ubuntu/Debian VPS with Docker Compose:

### 4.1 Sample `Dockerfile`

Create a `Dockerfile` in the server root:

```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 5000
CMD ["pnpm", "start"]
```

### 4.2 Start Services

```bash
# Build and run container in detached mode
docker compose up -d --build
```

### 4.3 Nginx Reverse Proxy Configuration

```nginx
server {
    server_name api.abdullahalmaksud.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Database Setup & MongoDB Atlas Security

1. **Create Atlas Cluster:**
   - Create an M0 (Free) or dedicated M10+ cluster on MongoDB Atlas.
   - Choose a region closest to your application users (e.g., `ap-southeast-1` Singapore or `us-east-1`).
2. **Network Access (IP Whitelist):**
   - For **Vercel Serverless**: Because serverless IPs are dynamic, add `0.0.0.0/0` (Allow Access from Anywhere) to Atlas Network Access, protected by strong user credentials.
   - For **Render / Dedicated VPS**: Whitelist the static outbound IP of your host.
3. **Database User Credentials:**
   - Create a database user with `readWrite` permissions on the `abdullahalmaksud` database.
   - Ensure the connection URI is encoded properly (escape special characters in passwords with URL encoding).

---

## 6. Resend Email & Domain Authentication (DNS)

To prevent OTP emails from landing in spam folders:

1. Register on [Resend](https://resend.com/) and go to **Domains > Add Domain**.
2. Add your sending domain (e.g., `abdullahalmaksud.com` or `mail.abdullahalmaksud.com`).
3. Add the generated DNS records into your DNS registrar:
   - **DKIM:** TXT record with selector `resend._domainkey`.
   - **SPF:** MX / TXT record pointing to Resend servers.
   - **DMARC:** TXT record `_dmarc.abdullahalmaksud.com` with `v=DMARC1; p=none;`.
4. Once verified, configure `EMAIL_FROM` with your authenticated domain (e.g. `Abdullah Al Maksud Admin <admin@abdullahalmaksud.com>`).

---

## 7. Vercel Blob Storage Configuration

1. In the Vercel Dashboard, go to **Storage > Create Database > Blob**.
2. Name your store (e.g., `abdullahalmaksud-media`).
3. Link the Blob store to your Vercel Project.
4. Copy the generated `BLOB_READ_WRITE_TOKEN` and add it to your environment variables.

---

## 8. Post-Deployment Verification Checklist

Run these commands to verify that your production deployment is fully functional:

```bash
# 1. Verify Root API JSON Status
curl -i https://api.abdullahalmaksud.com/?format=json

# 2. Verify Health Check and Database Connection
curl -i https://api.abdullahalmaksud.com/health

# 3. Request Sign-in OTP (check recipient inbox for 6-digit code)
curl -X POST https://api.abdullahalmaksud.com/api/auth/email-otp/send-verification-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@abdullahalmaksud.com","type":"sign-in"}'

# 4. Verify CORS Preflight on Production Origins
curl -I -X OPTIONS https://api.abdullahalmaksud.com/api/v1/projects \
  -H "Origin: https://abdullahalmaksud.com" \
  -H "Access-Control-Request-Method: GET"
```

---

## 9. Troubleshooting Common Issues

### Issue 1: `MongoServerSelectionError: Could not connect to any servers`

- **Cause:** MongoDB Atlas IP Whitelist has not authorized the server's IP address.
- **Remedy:** Add `0.0.0.0/0` in MongoDB Atlas Network Access if using Vercel.

### Issue 2: `504 Gateway Timeout` on `/api/auth/*`

- **Cause:** Body stream consumed before BetterAuth handler execution.
- **Remedy:** Ensure `api/index.ts` intercepts `/api/auth/*` prior to Hono listener processing.

### Issue 3: CORS error on frontend `Response to preflight request doesn't pass access control check`

- **Cause:** Frontend domain is missing from `CORS_ORIGIN` in `.env`.
- **Remedy:** Check `CORS_ORIGIN` variable and confirm the exact origin URL (including `https://` and without trailing slash). Note that all subdomains of `abdullahalmaksud.com` are auto-allowed.

### Issue 4: Admin endpoints return `401 Unauthorized` despite valid OTP

- **Cause:** The `Authorization` header is missing or `bearerToken` has expired.
- **Remedy:** Confirm requests pass `Authorization: Bearer <token>` or session cookies.
