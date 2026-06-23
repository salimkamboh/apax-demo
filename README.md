# APAX Auth Assessment

Small full-stack assessment that wires a Next.js login form to a Node.js/Express API backed by MongoDB. The API validates a MongoDB user and returns a signed JWT with the user ID in the token payload.

## Stack

- Next.js, React, TypeScript
- Node.js, Express, TypeScript
- MongoDB with Mongoose
- JWT authentication with `jsonwebtoken`
- Password hashing with `bcryptjs`

## Project Structure

```text
apps/
  api/  Express API, MongoDB user model, JWT login route
  web/  Next.js app with login form
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create API environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

Create web environment file:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Start MongoDB locally, then seed a demo user:

```bash
npm run seed --workspace @apax/api
```

Run both apps:

```bash
npm run dev
```

Open the Next.js app at `http://localhost:3000/login`.

Demo credentials:

```text
Email: demo@apax.local
Password: password123
```

## API

Health check:

```http
GET http://localhost:4000/health
```

Login:

```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "demo@apax.local",
  "password": "password123"
}
```

Successful response:

```json
{
  "token": "signed.jwt.token",
  "user": {
    "id": "mongodb-user-id",
    "email": "demo@apax.local",
    "name": "APAX Demo User"
  }
}
```

## Verification

Run TypeScript checks:

```bash
npm run typecheck
```

Run the frontend linter:

```bash
npm run lint
```

Build both apps:

```bash
npm run build
```

## Ubuntu 24 Deployment

This repo includes an SSH-based GitHub Actions pipeline and PM2 config for deployment to an Ubuntu 24 server with an existing MongoDB service.

### Server Prerequisites

Install Node.js 22, npm, Git, and PM2 on the server:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git
sudo npm install --global pm2
```

Create the deployment directory:

```bash
sudo mkdir -p /var/www/apax-auth-assessment
sudo chown -R "$USER":"$USER" /var/www/apax-auth-assessment
```

After the first deploy, create these server-only environment files in `DEPLOY_PATH`:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Set production values:

```text
apps/api/.env
PORT=4000
MONGODB_URI=your-existing-mongodb-uri
JWT_SECRET=use-a-long-random-secret
CLIENT_URL=https://your-domain.com
```

```text
apps/web/.env.local
NEXT_PUBLIC_API_URL=https://your-api-domain-or-path
```

Run the deploy script manually once if needed:

```bash
bash scripts/deploy.sh
```

### GitHub Actions Secrets

Add these secrets in GitHub under `Settings -> Secrets and variables -> Actions`:

```text
DEPLOY_HOST=your.server.ip.or.domain
DEPLOY_USER=ubuntu
DEPLOY_PORT=22
DEPLOY_SSH_KEY=private SSH key allowed to access the server
DEPLOY_PATH=/var/www/apax-auth-assessment
NEXT_PUBLIC_API_URL=https://your-api-domain-or-path
```

The workflow in `.github/workflows/deploy.yml` runs on pushes to `main`:

- Installs dependencies with `npm ci`.
- Runs TypeScript checks.
- Runs ESLint.
- Builds the API and Next.js app.
- Copies the repository files to the server over SSH.
- SSHes into the server and enters `DEPLOY_PATH`.
- Runs `scripts/deploy.sh`.
- Restarts the apps with PM2 using `ecosystem.config.cjs`.

### PM2 Commands

Check running apps:

```bash
pm2 status
```

View logs:

```bash
pm2 logs apax-api
pm2 logs apax-web
```

Restart manually:

```bash
pm2 restart apax-api apax-web
```

### Nginx Reverse Proxy

For production, put Nginx in front of the apps and proxy:

- Web app: `localhost:3000`
- API app: `localhost:4000`

Example server block:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://127.0.0.1:4000/health;
    }
}
```

## Change Summary

- Added an Express API with MongoDB connection and a user model.
- Implemented `/api/auth/login` with password verification and JWT generation using `JWT_SECRET`.
- Added a seed command for reviewer-friendly local testing.
- Added a Next.js login page with loading, error, and success states.
- Stored the JWT in `localStorage` after successful login.
