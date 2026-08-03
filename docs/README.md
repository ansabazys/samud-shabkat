# Samud Shabkat E-Commerce Platform

> A scalable B2B IT Hardware Ordering Platform built with Next.js, Fastify, PostgreSQL, Drizzle ORM, and Cloudflare R2.

---

# Project Overview

Samud Shabkat is a modern B2B ordering platform for IT hardware products.

The platform allows customers to:

- Browse Products
- Search Products
- View Technical Specifications
- Add Products to Cart
- Place Orders
- Track Order Status

Administrators can:

- Manage Products
- Manage Categories
- Manage Brands
- Manage Customers
- Manage Orders
- Manage Settings

The architecture is designed for long-term scalability and future expansion into a complete enterprise commerce solution.

---

# Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
- React Hook Form
- Zod

---

## Backend

- Fastify
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT
- Argon2
- Pino

---

## Infrastructure

- Docker
- Docker Compose
- Nginx
- Cloudflare
- Cloudflare R2
- Hostinger VPS

---

# Architecture

```
Next.js

↓

Fastify

↓

PostgreSQL

↓

Cloudflare R2
```

Architecture Style

```
Modular Monolith
```

---

# Repository Structure

```
samud-shabkat/

apps/

packages/

docs/

docker/

scripts/
```

---

# Documentation

## Core

- 00_PROJECT_OVERVIEW.md
- 01_TECH_STACK.md
- 02_ARCHITECTURE.md
- 03_FOLDER_STRUCTURE.md

---

## Database

- 04_DATABASE_ARCHITECTURE.md
- 05*DATABASE_SCHEMA.md *(Implementation Phase)\_

---

## Backend

- 05_API_REFERENCE.md
- 06_AUTHENTICATION.md
- 07_RBAC.md
- 09_BACKEND_GUIDE.md

---

## Frontend

- 08_FRONTEND_GUIDE.md
- 13_UI_UX_GUIDELINES.md

---

## Infrastructure

- 10_SYSTEM_WORKFLOWS.md
- 11_DEPLOYMENT.md
- 12_ENVIRONMENT.md
- 19_DEVOPS.md

---

## Engineering

- 14_CODING_STANDARDS.md
- 15_ROADMAP.md
- 16_FEATURES.md
- 17_FUTURE_SCOPE.md
- 18_ARCHITECTURE_DECISIONS.md
- 20_PROJECT_CHECKLIST.md

---

# Development Workflow

```
Setup

↓

Database

↓

Authentication

↓

RBAC

↓

Catalog

↓

Storefront

↓

Cart

↓

Checkout

↓

Orders

↓

Dashboard

↓

Deployment
```

---

# Build Order

Phase 1

- Foundation

Phase 2

- Database

Phase 3

- Authentication

Phase 4

- Catalog

Phase 5

- Storefront

Phase 6

- Orders

Phase 7

- Dashboard

Phase 8

- Deployment

---

# Design Principles

- Modular Architecture
- Feature-Based Structure
- Type Safety
- Permission-Based RBAC
- REST APIs
- Reusable Components
- Clean Code
- SOLID Principles

---

# Future Scope

Planned modules

- Inventory
- Warehouse
- Suppliers
- Payment Gateway
- Mobile Application
- ERP Integration
- AI Features

---

# Project Status

Current Version

```
Version 1.0.0
```

Development Stage

```
Architecture Complete

Ready for Implementation
```

---

# License

Private Project

Copyright © Samud Shabkat

---

# Maintainer

**Mohammed Ansab K**

Full Stack Developer
