# Deployment Guide

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 11_DEPLOYMENT.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Deployment Overview
2. Infrastructure
3. Production Architecture
4. Server Specifications
5. Operating System
6. Docker Architecture
7. Nginx
8. Cloudflare
9. PostgreSQL
10. Cloudflare R2
11. Environment Variables
12. CI/CD
13. Security
14. Monitoring
15. Backup Strategy
16. Deployment Workflow
17. Production Checklist

---

# 1. Deployment Overview

The application is deployed on a Linux VPS using Docker containers.

Production consists of:

- Next.js Frontend
- Fastify Backend
- PostgreSQL Database
- Nginx Reverse Proxy
- Cloudflare CDN
- Cloudflare R2
- Resend Email Service

Everything runs inside Docker except Cloudflare and Resend.

---

# 2. Infrastructure

```
Internet

↓

Cloudflare

↓

Hostinger VPS

↓

Nginx

↓

Docker Network

↓

Next.js

↓

Fastify

↓

PostgreSQL

↓

Cloudflare R2
```

---

# 3. Production Architecture

```
                 Internet
                     │
                     ▼
              Cloudflare CDN
                     │
                     ▼
              Hostinger VPS
                     │
             Reverse Proxy (Nginx)
          ┌──────────┴──────────┐
          ▼                     ▼
     Next.js App          Fastify API
                                │
                                ▼
                        PostgreSQL Database
                                │
                                ▼
                        Cloudflare R2
```

---

# 4. VPS Specification

Recommended

CPU

4 vCPU

Memory

16 GB RAM

Storage

200 GB SSD

Operating System

Ubuntu 24.04 LTS

---

# 5. Software Installed

Ubuntu

Docker

Docker Compose

Git

Node.js

Nginx

Certbot (Optional)

Fail2Ban

UFW Firewall

---

# 6. Docker Architecture

Containers

```
frontend

backend

postgres

nginx
```

Future

```
redis

queue

worker
```

---

# 7. Docker Compose

Services

```
frontend

backend

database

nginx
```

Volumes

```
postgres-data

logs
```

Network

```
samud-network
```

---

# 8. Nginx

Responsibilities

- Reverse Proxy
- SSL
- Compression
- Cache Headers
- Static Assets
- Security Headers

Routes

```
/

↓

Next.js

/api

↓

Fastify
```

---

# 9. Cloudflare

Responsibilities

- DNS
- SSL
- CDN
- DDoS Protection
- Caching

Enable

- Always HTTPS
- Brotli
- HTTP/3
- Auto Minify

---

# 10. PostgreSQL

Runs inside Docker.

Daily Backup

Indexes

Monitoring

Only backend container can access database.

No external database exposure.

---

# 11. Cloudflare R2

Stores

- Product Images
- Future Documents

Database stores only

- URL
- Key
- Metadata

---

# 12. Environment Variables

Frontend

```
NEXT_PUBLIC_API_URL

NEXT_PUBLIC_SITE_URL
```

Backend

```
DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

R2_ACCOUNT_ID

R2_BUCKET

R2_ACCESS_KEY

R2_SECRET_KEY

RESEND_API_KEY

NODE_ENV
```

---

# 13. CI/CD

Repository

GitHub

Workflow

```
Push

↓

GitHub

↓

Build

↓

Deploy

↓

Restart Containers
```

Future

GitHub Actions

---

# 14. Security

Enable

HTTPS

Firewall

Fail2Ban

Rate Limiting

Helmet

CORS

JWT

Argon2

Never expose

.env

Database

Secrets

---

# 15. Logging

Log

Application

Access

Errors

Authentication

Orders

Uploads

Logs should be rotated automatically.

---

# 16. Monitoring

Monitor

CPU

RAM

Disk

Containers

Database

Nginx

Future

Grafana

Prometheus

---

# 17. Backup Strategy

Database

Daily

Images

Cloudflare R2

Source Code

GitHub

Retention

30 Days

---

# 18. Deployment Workflow

```
Developer

↓

GitHub

↓

Build Docker Images

↓

Deploy VPS

↓

Run Migrations

↓

Start Containers

↓

Health Check

↓

Production Ready
```

---

# 19. Production Checklist

Before deployment

- Environment Variables
- Database Migration
- Seed Initial Data
- Build Frontend
- Build Backend
- Configure Nginx
- Configure Cloudflare
- Configure R2
- Configure Email
- Test APIs
- Test Authentication
- Test Orders
- Test Uploads
- Test Emails

After deployment

- Monitor Logs
- Verify SSL
- Test Performance
- Verify Backups

---

# 20. Scaling Strategy

Current

```
One VPS

↓

Docker

↓

PostgreSQL
```

Future

```
Load Balancer

↓

Frontend

↓

Backend

↓

Redis

↓

Workers

↓

Database Cluster
```

---

# 21. Disaster Recovery

In case of failure

1. Restore VPS
2. Restore Database Backup
3. Restore Environment Variables
4. Deploy Latest Docker Images
5. Verify Cloudflare DNS
6. Run Health Checks

Recovery Time Goal

< 1 Hour

---

# 22. Summary

The deployment architecture is designed to provide:

- Secure Hosting
- Easy Maintenance
- Containerized Deployment
- Scalable Infrastructure
- Reliable Backups
- Cloud Storage
- Production Readiness

The current deployment strategy is optimized for the initial project scope while allowing future horizontal scaling as business requirements grow.

---

# Document Information

| Property      | Value            |
| ------------- | ---------------- |
| Document      | 11_DEPLOYMENT.md |
| Version       | 1.0.0            |
| Last Updated  | August 2026      |
| Maintained By | Mohammed Ansab K |
