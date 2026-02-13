# Ngotag Schema File Server

A lightweight **Deno-based JSON-LD schema file server** for serving and managing verifiable credential schemas, designed for Self-Sovereign Identity (SSI) projects. Supports JWT authentication and Docker deployments.

---

## Features

* Serve JSON-LD schema files via HTTP GET
* Supports UUID or alphanumeric schema IDs
* JWT-based auth for protected routes
* CORS-enabled for public access
* Deno setup with import map and lockfile

---

## Setup

1. **Clone repository**

```bash
git clone https://github.com/Bhutan-NDI/ngotag-schema-file-server.git
cd ngotag-schema-file-server
```

2. **Cache dependencies**

```bash
deno task cache
```

3. **Create `.env` file** (based on `.env.sample`)

```env
JWT_TOKEN_SECRET=your-base64-secret
ISSUER=your-issuer
PORT=8000
```

4. **Start server (dev or prod)**

```bash
deno task dev   # development with watch
deno task start # production
```

---

## Docker Deployment

```bash
docker build -t ngotag-schema-server .
docker run -d -p 8000:8000 --env-file .env ngotag-schema-server
```

* Schemas are accessible under `/app/schemas` in the container

---

## Scripts (`deno task`)

* `dev` – Start server in watch mode
* `start` – Production start
* `cache` – Cache & lock dependencies
* `lint` – Lint TypeScript files
* `fmt` – Format code
* `check` – Type check files
* `docker-start` – Start server in Docker

---

## Security Notes

* Only enable required permissions: `--allow-net`, `--allow-env`, `--allow-read=/app/schemas`, `--allow-write=/app/schemas`
* Validate schema IDs (`^[\w-]+$`) to prevent path traversal
* Keep secrets in `.env`

---

## License

MIT License © 2026 Bhutan-NDI
