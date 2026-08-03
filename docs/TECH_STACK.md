# Technology Stack

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Version:** 1.0.0

---

# Table of Contents

1. Technology Overview
2. System Architecture
3. Frontend Stack
4. Backend Stack
5. Database
6. Object Storage
7. Authentication
8. Validation
9. State Management
10. UI Libraries
11. Development Tools
12. Deployment Stack
13. Project Structure
14. Why These Technologies?
15. Future Upgrade Path

---

# 1. Technology Overview

The project is built using a modern TypeScript-first technology stack focused on scalability, maintainability, security, and long-term support.

The application follows a **Modular Monolith Architecture** inside a **Monorepo**, allowing shared code while keeping the application easy to maintain and extend.

---

# 2. System Architecture

```

                    Internet
                        │
                        ▼
                 Cloudflare DNS
                        │
                        ▼
                    Nginx Server
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
    Next.js Frontend             Fastify REST API
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                  PostgreSQL Database         Cloudflare R2
                         │
                         ▼
                   Email Service

```

---

# 3. Frontend Technology Stack

## Framework

### Next.js

Purpose

- Customer Website
- Admin Dashboard
- Super Admin Dashboard

Why Next.js?

- App Router
- Server Components
- Excellent SEO
- Fast Performance
- Image Optimization
- Production Ready
- Large Ecosystem

---

## Language

### TypeScript

Purpose

Entire frontend is written using TypeScript.

Benefits

- Type Safety
- Better IDE Support
- Autocomplete
- Compile-time Error Detection
- Easier Refactoring

---

## Styling

### Tailwind CSS

Purpose

Rapid UI Development

Benefits

- Utility First
- Responsive Design
- Small Bundle Size
- Easy Maintenance

---

## Component Library

### shadcn/ui

Purpose

Reusable UI Components

Examples

- Button
- Card
- Dialog
- Sheet
- Dropdown
- Table
- Form
- Toast
- Calendar

Why?

- Accessible
- Customizable
- No Vendor Lock-in
- Tailwind Native

---

## Icons

Lucide React

Purpose

Consistent SVG Icons

Examples

- Dashboard
- Cart
- Products
- Users
- Orders
- Settings

---

## Forms

React Hook Form

Purpose

Manage forms efficiently.

Benefits

- High Performance
- Easy Validation
- Minimal Re-render

---

## Form Validation

Zod

Purpose

Runtime Validation

Used For

- Login
- Register
- Product Forms
- Checkout
- Admin Forms

---

## Data Fetching

TanStack Query

Purpose

Server State Management

Responsibilities

- API Requests
- Caching
- Background Refetch
- Loading State
- Error Handling

---

## Client State

Zustand

Purpose

Global Client State

Used For

- Shopping Cart
- User Session
- Sidebar
- Theme
- UI Preferences

---

## HTTP Client

Native Fetch API

Reason

Next.js already provides excellent support.

No need for Axios.

---

# 4. Backend Technology Stack

## Framework

Fastify

Purpose

REST API Server

Why?

- Extremely Fast
- Lightweight
- Plugin Architecture
- TypeScript Friendly
- Better Performance than Express

---

## Language

TypeScript

Entire backend uses TypeScript.

---

## ORM

Drizzle ORM

Purpose

Database Queries

Benefits

- SQL First
- Type Safe
- Lightweight
- Easy Migration
- Excellent Type Inference

---

## Database Driver

postgres

Official PostgreSQL driver used with Drizzle.

---

## Password Hashing

Argon2

Purpose

Secure Password Storage

Never store plain passwords.

---

## Authentication

JWT

Used For

Access Token

Refresh Token

Protected Routes

---

## API Documentation

Swagger

Purpose

Interactive API Documentation

---

## Logging

Pino

Purpose

Application Logs

API Logs

Error Logs

Performance Logs

---

# 5. Database

PostgreSQL

Why?

- Reliable
- ACID Compliance
- Powerful SQL
- Open Source
- Excellent Performance
- Supports Complex Queries

Main Tables

Users

Customer Profiles

Products

Categories

Brands

Orders

Order Items

Product Images

Product Specifications

Settings

---

# 6. Object Storage

Cloudflare R2

Purpose

Store

- Product Images
- Documents
- Future Attachments

Advantages

- Cheap
- CDN Ready
- Scalable
- No Database Bloat

---

# 7. Email Service

Resend

Purpose

Transactional Emails

Examples

Order Confirmation

Order Approved

Ready For Collection

Completed

Cancelled

Future

Password Reset

Email Verification

---

# 8. Authentication

Authentication Method

JWT

Access Token

Refresh Token

Password Hashing

Argon2

Authorization

RBAC

---

# 9. Validation

Frontend

React Hook Form

↓

Zod

↓

API

↓

Backend

↓

Zod Validation

↓

Database

Validation happens on both frontend and backend.

Never trust frontend validation alone.

---

# 10. State Management

Client State

Zustand

Server State

TanStack Query

Form State

React Hook Form

Local Component State

React Hooks

---

# 11. File Upload

Customer

↓

Browser

↓

Backend API

↓

Cloudflare R2

↓

Store URL

↓

Database

Only URLs are stored inside PostgreSQL.

Images never go directly into the database.

---

# 12. Development Tools

Package Manager

pnpm

Monorepo

Turborepo

Version Control

Git

Repository

GitHub

Linting

ESLint

Formatting

Prettier

Commit Convention

Conventional Commits

---

# 13. Deployment Stack

Operating System

Ubuntu Server

Reverse Proxy

Nginx

Containers

Docker

Container Orchestration

Docker Compose

SSL

Cloudflare

Domain

Hostinger

Server

Hostinger VPS

---

# 14. Monorepo

The application follows a monorepo architecture.

```

samud-shabkat/

apps/
web/
api/

packages/
database/
ui/
validation/
types/
config/

docs/

```

Benefits

- Shared Types
- Shared Validation
- Shared UI
- Easier Refactoring
- Better Developer Experience

---

# 15. Package Responsibilities

## database

Contains

- Schema
- Relations
- Migrations
- Seeders

---

## validation

Contains

Shared Zod Schemas

---

## types

Contains

Shared Interfaces

Enums

DTO Types

---

## config

Contains

Application Configurations

Constants

Environment Helpers

---

## ui

Contains

Reusable UI Components

---

# 16. Development Standards

✔ TypeScript Only

✔ Strict Mode

✔ Feature Based Structure

✔ Modular Design

✔ Reusable Components

✔ Shared Types

✔ Shared Validation

✔ Repository Pattern

✔ Service Layer

✔ Controller Layer

✔ API First Development

✔ Clean Folder Structure

---

# 17. Technologies Not Used

The following technologies are intentionally excluded from Version 1.

Redis

Reason

Not required for current scale.

---

RabbitMQ

Reason

No asynchronous workloads yet.

---

Microservices

Reason

Unnecessary complexity.

Modular Monolith is sufficient.

---

Elasticsearch

Reason

PostgreSQL Search is enough for ~1000 products.

---

GraphQL

Reason

REST API is simpler for this project.

---

NextAuth

Reason

Custom JWT Authentication provides more flexibility.

---

# 18. Future Upgrade Path

As the business grows, the architecture can evolve.

Phase 2

Redis

Background Jobs

Inventory

Payments

---

Phase 3

RabbitMQ

Notifications

Reporting

Analytics

---

Phase 4

Microservices

Order Service

Inventory Service

Customer Service

Notification Service

Payment Service

---

Phase 5

Mobile Application

React Native

Shared API

Shared Authentication

---

# 19. Summary

This technology stack was selected to balance:

- Simplicity
- Performance
- Security
- Scalability
- Maintainability
- Cost Efficiency

The chosen architecture avoids unnecessary complexity while remaining flexible enough to support future business growth.

---

# Document Information

| Property      | Value            |
| ------------- | ---------------- |
| Document      | 01_TECH_STACK.md |
| Version       | 1.0.0            |
| Maintained By | Mohammed Ansab K |
| Last Updated  | August 2026      |
