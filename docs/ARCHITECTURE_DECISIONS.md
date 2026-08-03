# Architecture Decisions

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 18_ARCHITECTURE_DECISIONS.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Purpose
2. Decision Process
3. ADR-001 Monorepo
4. ADR-002 Fastify
5. ADR-003 Next.js
6. ADR-004 PostgreSQL
7. ADR-005 Drizzle ORM
8. ADR-006 JSONB Specifications
9. ADR-007 Cloudflare R2
10. ADR-008 JWT Authentication
11. ADR-009 Permission Based RBAC
12. ADR-010 Docker
13. ADR-011 Hostinger VPS
14. ADR-012 Modular Monolith
15. Future ADRs

---

# Purpose

This document records important architectural decisions made during the development of the project.

The purpose is to explain **why** a technology or approach was chosen, making future maintenance and onboarding easier.

Every major architectural change should be documented here.

---

# Decision Process

Each decision contains:

- Context
- Decision
- Benefits
- Trade-offs
- Future Considerations

---

# ADR-001

## Monorepo

### Context

The project contains multiple applications and shared code.

### Decision

Use a **pnpm Workspace + Turborepo** monorepo.

### Benefits

- Shared packages
- Faster builds
- Single dependency management
- Easier code sharing
- Consistent tooling

### Trade-offs

- Slightly more complex initial setup
- Requires workspace knowledge

---

# ADR-002

## Fastify

### Context

A modern backend framework was required.

### Decision

Use **Fastify** instead of Express or NestJS.

### Benefits

- High performance
- Plugin architecture
- TypeScript support
- Low overhead
- Excellent ecosystem

### Trade-offs

- Smaller community than Express
- Fewer tutorials than NestJS

---

# ADR-003

## Next.js

### Context

The frontend requires SEO, routing, and server-side rendering.

### Decision

Use **Next.js App Router**.

### Benefits

- SEO
- Server Components
- Image Optimization
- Routing
- Performance

---

# ADR-004

## PostgreSQL

### Context

The application requires relational data and transactional consistency.

### Decision

Use PostgreSQL.

### Benefits

- ACID compliance
- JSONB support
- Excellent indexing
- Mature ecosystem
- Scalable

---

# ADR-005

## Drizzle ORM

### Context

A type-safe ORM with minimal overhead was required.

### Decision

Use Drizzle ORM.

### Benefits

- SQL-first approach
- Type safety
- Lightweight
- Fast migrations
- Excellent TypeScript integration

### Trade-offs

- Smaller ecosystem than Prisma
- Requires stronger SQL knowledge

---

# ADR-006

## JSONB for Product Specifications

### Context

Different hardware categories contain different specifications.

Examples

- Laptop
- Printer
- Router
- SSD
- NAS

Each category has unique attributes.

### Decision

Store technical specifications inside a PostgreSQL JSONB column.

### Benefits

- Unlimited attributes
- No schema changes
- Flexible
- GIN indexing
- Easy frontend rendering

### Trade-offs

- More complex filtering for some queries
- Requires JSONB indexes for optimal performance

---

# ADR-007

## Cloudflare R2

### Context

Product images should not be stored on the VPS.

### Decision

Use Cloudflare R2 for object storage.

### Benefits

- Scalable
- Low cost
- Durable
- CDN friendly
- Easy integration

---

# ADR-008

## JWT Authentication

### Context

The application requires stateless authentication.

### Decision

Use JWT Access Token + Refresh Token.

### Benefits

- Stateless
- Secure
- Scalable
- Suitable for APIs

---

# ADR-009

## Permission-Based RBAC

### Context

The application supports multiple user roles.

Future roles may include:

- Sales Manager
- Inventory Manager
- Warehouse Manager

### Decision

Use permissions instead of hardcoded role checks.

### Benefits

- Flexible
- Database-driven
- Scalable
- Easier administration

---

# ADR-010

## Docker

### Context

Consistent environments are required.

### Decision

Containerize the application.

### Benefits

- Reproducible builds
- Easier deployment
- Simplified dependency management

---

# ADR-011

## Hostinger VPS

### Context

The initial deployment requires a cost-effective VPS.

### Decision

Deploy on Hostinger VPS.

### Benefits

- Affordable
- Full server control
- Docker support
- Easy upgrades

Future deployments may migrate to cloud infrastructure if business requirements change.

---

# ADR-012

## Modular Monolith

### Context

The project starts with a moderate feature set but is expected to grow.

### Decision

Use a Modular Monolith architecture instead of microservices.

### Benefits

- Easier development
- Simpler deployment
- Shared database
- Lower operational complexity
- Clear module boundaries

Future services can be extracted if scaling requirements justify it.

---

# Future ADRs

Future architectural decisions should be added here.

Examples

- Redis Integration
- Queue System
- Search Engine
- Payment Gateway
- ERP Integration
- Multi-tenancy
- Event Bus

---

# Summary

Architecture Decision Records preserve the reasoning behind technical choices.

Maintaining this document helps future developers understand the evolution of the system and reduces unnecessary architectural changes.

---

# Document Information

| Property      | Value                        |
| ------------- | ---------------------------- |
| Document      | 18_ARCHITECTURE_DECISIONS.md |
| Version       | 1.0.0                        |
| Last Updated  | August 2026                  |
| Maintained By | Mohammed Ansab K             |
