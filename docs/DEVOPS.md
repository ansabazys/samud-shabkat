# DevOps Guide

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 19_DEVOPS.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. DevOps Overview
2. Infrastructure
3. Production Architecture
4. Docker
5. Docker Compose
6. Nginx
7. Cloudflare
8. CI/CD
9. GitHub Actions
10. Database Migration
11. Monitoring
12. Logging
13. Backups
14. Security
15. SSL
16. Release Strategy
17. Rollback Strategy
18. Maintenance
19. Scaling

---

# 1. DevOps Overview

The project follows a containerized deployment strategy.

Goals

- Consistent Environments
- Easy Deployment
- High Availability
- Secure Infrastructure
- Automated Releases
- Reliable Backups

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

Docker

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
                Cloudflare
                     │
                     ▼
                 Nginx Proxy
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   Next.js Container        Fastify Container
                                      │
                                      ▼
                             PostgreSQL Container
                                      │
                                      ▼
                             Cloudflare R2
```

---

# 4. Docker

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

worker

scheduler
```

---

Dockerfiles

```
Dockerfile.web

Dockerfile.api
```

---

# 5. Docker Compose

Services

```
frontend

backend

postgres

nginx
```

Volumes

```
postgres_data

logs
```

Network

```
samud-network
```

---

# 6. Nginx

Responsibilities

- Reverse Proxy
- HTTPS
- Compression
- Security Headers
- Static Assets
- API Routing

Routing

```
/

↓

Next.js

/api

↓

Fastify
```

---

# 7. Cloudflare

Responsibilities

- DNS
- SSL
- CDN
- Caching
- DDoS Protection

Recommended Features

- Always HTTPS
- Brotli Compression
- HTTP/3
- Automatic Cache

---

# 8. CI/CD

Repository

GitHub

Workflow

```
Developer

↓

Push

↓

GitHub

↓

Build

↓

Run Tests

↓

Deploy

↓

Restart Containers
```

---

# 9. GitHub Actions

Pipeline

```
Install Dependencies

↓

Lint

↓

Type Check

↓

Run Tests

↓

Build Frontend

↓

Build Backend

↓

Build Docker Images

↓

Deploy
```

---

# 10. Database Migration

Deployment Workflow

```
Pull Latest Code

↓

Build Containers

↓

Run Drizzle Migrations

↓

Seed (If Needed)

↓

Restart API

↓

Health Check
```

Never modify production tables manually.

---

# 11. Monitoring

Monitor

- CPU
- RAM
- Disk
- Docker Containers
- Database
- API Response Time

Future

- Grafana
- Prometheus

---

# 12. Logging

Application Logs

```
Authentication

Orders

Products

Uploads

Errors
```

Infrastructure Logs

```
Docker

Nginx

System
```

Never log

- Passwords
- Tokens
- Secrets

---

# 13. Backup Strategy

Database

Daily

Retention

30 Days

Storage

Remote Backup Location

Images

Cloudflare R2

Source Code

GitHub

---

# 14. Security

Use

- HTTPS
- Helmet
- Rate Limiting
- JWT
- Argon2
- Secure Cookies
- Firewall
- Fail2Ban

Disable

- Directory Listing
- Debug Mode
- Stack Traces

---

# 15. SSL

Provider

Cloudflare

Future

Let's Encrypt

HTTPS should be enforced.

---

# 16. Release Strategy

Every release follows

```
Feature Complete

↓

Testing

↓

Build

↓

Deploy

↓

Smoke Test

↓

Production
```

Release Types

- Patch
- Minor
- Major

Semantic Versioning

```
1.0.0
```

---

# 17. Rollback Strategy

If deployment fails

```
Stop Deployment

↓

Restore Previous Docker Image

↓

Restore Database Backup (If Required)

↓

Restart Containers

↓

Verify Health
```

Rollback should be tested periodically.

---

# 18. Maintenance

Weekly

- Review Logs
- Verify Backups
- Check Disk Usage

Monthly

- Update Dependencies
- Rotate Secrets (when required)
- Security Review

Quarterly

- Dependency Audit
- Infrastructure Review
- Performance Review

---

# 19. Scaling Strategy

Current

```
Single VPS
```

Future

```
Load Balancer

↓

Multiple Frontend Instances

↓

Multiple Backend Instances

↓

Redis Cache

↓

Queue Workers

↓

Database Replica
```

---

# 20. Disaster Recovery

Recovery Steps

1. Restore VPS
2. Restore Database
3. Restore Environment Variables
4. Deploy Latest Stable Release
5. Verify Services
6. Perform Health Checks

Target Recovery Time

Less than 1 Hour

---

# 21. Health Checks

Health Endpoints

```
GET /health

GET /ready

GET /live
```

Checks

- Database Connection
- Storage Connection
- Email Service
- API Status

---

# 22. DevOps Checklist

Before Deployment

- Environment Variables
- Database Backup
- Successful Build
- Tests Passed
- Migrations Ready
- SSL Configured
- Docker Images Built

After Deployment

- Health Checks
- Smoke Tests
- Verify Logs
- Verify Monitoring
- Verify Email
- Verify Image Uploads

---

# Summary

The DevOps architecture provides:

- Reliable deployments
- Secure infrastructure
- Automated releases
- Monitoring
- Disaster recovery
- Easy scalability

This strategy supports both the current project requirements and future business growth.

---

# Document Information

| Property      | Value            |
| ------------- | ---------------- |
| Document      | 19_DEVOPS.md     |
| Version       | 1.0.0            |
| Last Updated  | August 2026      |
| Maintained By | Mohammed Ansab K |
