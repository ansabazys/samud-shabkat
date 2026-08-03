# Environment Configuration Guide

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 12_ENVIRONMENT.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Environment Overview
2. Environment Types
3. Environment Files
4. Frontend Variables
5. Backend Variables
6. Shared Configuration
7. Environment Validation
8. Secrets Management
9. Production Guidelines
10. Local Development
11. Deployment Environment
12. Best Practices

---

# 1. Environment Overview

The project uses environment variables to separate configuration from application code.

Benefits

- Secure Secrets
- Multiple Environments
- Easy Deployment
- Configurable Applications
- Better Maintainability

Configuration should never be hardcoded.

---

# 2. Environment Types

The application supports multiple environments.

```
Development

↓

Testing

↓

Staging

↓

Production
```

Each environment uses its own configuration.

---

# 3. Environment Files

Root

```
.env.example
```

Frontend

```
apps/web/.env.local

apps/web/.env.production
```

Backend

```
apps/api/.env

apps/api/.env.production
```

Never commit actual `.env` files.

---

# 4. Frontend Environment Variables

API

```
NEXT_PUBLIC_API_URL
```

Example

```
https://api.samudshabkat.com/api/v1
```

---

Website

```
NEXT_PUBLIC_SITE_URL
```

Example

```
https://samudshabkat.com
```

---

Image Domain

```
NEXT_PUBLIC_IMAGE_URL
```

Used for Cloudflare R2.

---

Application Name

```
NEXT_PUBLIC_APP_NAME
```

---

Environment

```
NEXT_PUBLIC_ENVIRONMENT
```

Values

```
development

production
```

---

# 5. Backend Environment Variables

Application

```
NODE_ENV

PORT
```

---

Database

```
DATABASE_URL
```

---

Authentication

```
JWT_SECRET

JWT_REFRESH_SECRET

JWT_ACCESS_EXPIRES

JWT_REFRESH_EXPIRES
```

---

Cloudflare R2

```
R2_ACCOUNT_ID

R2_BUCKET_NAME

R2_ACCESS_KEY

R2_SECRET_KEY

R2_ENDPOINT

R2_PUBLIC_URL
```

---

Email

```
RESEND_API_KEY

EMAIL_FROM
```

---

Application

```
APP_NAME

APP_URL
```

---

Logging

```
LOG_LEVEL
```

---

Security

```
CORS_ORIGIN
```

---

# 6. Shared Configuration

Shared configuration belongs inside

```
packages/config
```

Examples

```
Roles

Permissions

Order Status

Payment Status

Routes

Application Constants
```

Never duplicate configuration.

---

# 7. Environment Validation

The backend validates all environment variables during startup.

Example

```
Application

↓

Load .env

↓

Validate

↓

Missing?

↓

Stop Startup

↓

Success

↓

Run Server
```

The application should never start with invalid configuration.

---

# 8. Secrets Management

Sensitive values include

```
Database Password

JWT Secret

Refresh Secret

R2 Secret Key

Email API Key
```

Never expose these values.

---

# 9. Production Guidelines

Production should use

```
NODE_ENV=production
```

Enable

- HTTPS
- Secure Cookies
- Compression
- Logging
- Security Headers

Disable

- Debug Logs
- Development Errors
- Test Data

---

# 10. Local Development

Requirements

- PostgreSQL
- Docker
- Cloudflare R2 Credentials
- Email API Key

Local setup

```
Clone Repository

↓

Install Dependencies

↓

Copy .env.example

↓

Configure Values

↓

Run Migrations

↓

Seed Database

↓

Start Development
```

---

# 11. Docker Environment

Docker containers receive environment variables through

```
docker-compose.yml
```

Never hardcode secrets inside Dockerfiles.

---

# 12. GitHub Actions

Production secrets should be stored inside GitHub Secrets.

Examples

```
DATABASE_URL

JWT_SECRET

R2_SECRET_KEY

RESEND_API_KEY
```

Never commit secrets.

---

# 13. Environment Hierarchy

Priority

```
Runtime Variables

↓

Docker Variables

↓

.env.production

↓

.env

↓

Default Values
```

---

# 14. Example .env.example

```
NODE_ENV=development

PORT=4000

DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES=15m

JWT_REFRESH_EXPIRES=30d

APP_NAME=

APP_URL=

R2_ACCOUNT_ID=

R2_BUCKET_NAME=

R2_ACCESS_KEY=

R2_SECRET_KEY=

R2_ENDPOINT=

R2_PUBLIC_URL=

RESEND_API_KEY=

EMAIL_FROM=

LOG_LEVEL=info

CORS_ORIGIN=http://localhost:3000

NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_IMAGE_URL=

NEXT_PUBLIC_APP_NAME=Samud Shabkat

NEXT_PUBLIC_ENVIRONMENT=development
```

---

# 15. Configuration Principles

✔ Never Hardcode Secrets

✔ Validate Environment Variables

✔ Separate Development & Production

✔ Use Strong JWT Secrets

✔ Store Secrets Securely

✔ Keep .env.example Updated

✔ Use Type-Safe Configuration

---

# 16. Summary

The environment configuration system is designed to provide:

- Secure secret management
- Easy deployment
- Environment isolation
- Consistent configuration
- Type-safe startup validation

Proper environment management ensures that the application behaves consistently across development, staging, and production.

---

# Document Information

| Property      | Value             |
| ------------- | ----------------- |
| Document      | 12_ENVIRONMENT.md |
| Version       | 1.0.0             |
| Last Updated  | August 2026       |
| Maintained By | Mohammed Ansab K  |
