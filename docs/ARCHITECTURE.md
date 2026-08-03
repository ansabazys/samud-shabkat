# System Architecture

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Version:** 1.0.0

---

# Table of Contents

1. Architecture Philosophy
2. High-Level Architecture
3. Monorepo Architecture
4. Frontend Architecture
5. Backend Architecture
6. Package Architecture
7. Request Lifecycle
8. Authentication Flow
9. Authorization (RBAC)
10. Dashboard Architecture
11. Database Architecture
12. Storage Architecture
13. Email Architecture
14. Module Boundaries
15. Deployment Architecture
16. Scalability Strategy
17. Design Principles

---

# 1. Architecture Philosophy

The application follows a **Modular Monolith Architecture** inside a **Monorepo**.

This architecture provides:

- Simple deployment
- Easy maintenance
- High code reuse
- Shared types
- Shared validation
- Shared configuration
- Easier debugging
- Future scalability

Instead of splitting the project into microservices from the beginning, all business modules live inside a single backend application while remaining logically separated.

---

# 2. High-Level Architecture

```

                         Customer
                              │
                              ▼
                    Next.js Frontend
                              │
                    REST API Requests
                              │
                              ▼
                    Fastify Backend API
                              │
      ┌───────────────────────┼───────────────────────┐
      ▼                       ▼                       ▼
 PostgreSQL             Cloudflare R2          Email Service
 Database               Image Storage          Notifications

```

---

# 3. Monorepo Architecture

```

samud-shabkat/

apps/
│
├── web/
│
└── api/

packages/
│
├── database/
├── validation/
├── types/
├── ui/
└── config/

docs/

```

---

## Why Monorepo?

Advantages

- Shared code
- Shared validation
- Shared types
- Easier dependency management
- One repository
- Easier versioning
- Better developer experience

---

# 4. Frontend Architecture

The frontend is built using **Next.js App Router**.

```

Browser

↓

Next.js

↓

Page

↓

Feature

↓

Components

↓

API Client

↓

Fastify API

```

The frontend has two major sections:

```

Public Store

Admin Panel

```

Both live inside the same Next.js application.

---

## Frontend Layers

```

Pages

↓

Features

↓

Shared Components

↓

API Layer

↓

Backend

```

Responsibilities

### Pages

Responsible only for:

- Layout
- Routing
- Metadata

---

### Features

Business Logic

Examples

- Cart
- Products
- Checkout
- Orders

---

### Components

Reusable UI

Examples

- Button
- Card
- Modal
- Table
- Input
- Dialog

---

### API Layer

Responsible for

- HTTP Requests
- Response Parsing
- Error Handling

---

# 5. Backend Architecture

The backend follows a layered architecture.

```

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Database

```

---

## Responsibilities

### Routes

Responsible for

- HTTP Endpoints
- Route Registration

No business logic.

---

### Controllers

Responsible for

- Receiving Requests
- Calling Services
- Returning Responses

No business logic.

---

### Services

Responsible for

- Business Logic
- Validation
- Rules
- Transactions

Most application logic lives here.

---

### Repositories

Responsible for

- Database Queries
- CRUD Operations
- SQL

Only database operations.

---

### Database

Responsible only for storing data.

---

# 6. Package Architecture

```

packages/

database/

validation/

types/

config/

ui/

```

---

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

Interfaces

Enums

DTOs

Shared Models

---

## config

Contains

Application Constants

Environment Helpers

Configuration

---

## ui

Reusable Components

Shared Design System

---

# 7. Request Lifecycle

Example

Customer opens product page.

```

Browser

↓

Next.js

↓

GET /products/monitor

↓

Fastify

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

↓

Next.js

↓

UI

```

---

# 8. Authentication Flow

Authentication uses JWT.

```

Customer Login

↓

Validate Credentials

↓

Generate Access Token

↓

Generate Refresh Token

↓

Store Secure Cookie

↓

Authenticated Session

```

Every protected request follows:

```

Browser

↓

Access Token

↓

Authentication Middleware

↓

User Verified

↓

Controller

```

---

# 9. Authorization (RBAC)

Roles

```

SUPER_ADMIN

ADMIN

CUSTOMER

```

Flow

```

Request

↓

Authentication

↓

Role Check

↓

Permission Check

↓

Controller

↓

Service

```

Example

```

Customer

↓

/admin/products

↓

403 Forbidden

```

Example

```

Admin

↓

/admin/products

↓

Allowed

```

---

# 10. Dashboard Architecture

There is **one dashboard application** with role-based rendering.

```

Login

↓

Get User

↓

Get Role

↓

Load Permissions

↓

Render Dashboard

```

Example

```

SUPER_ADMIN

Dashboard

Products

Categories

Brands

Orders

Customers

Admins

Settings

```

Example

```

ADMIN

Dashboard

Products

Categories

Brands

Orders

Customers

```

The pages exist only once.

Visibility depends on permissions.

---

# 11. Database Architecture

```

Users

│

├── Customer Profile

│

├── Orders

│

└── Roles

Products

│

├── Images

├── Specifications

├── Brand

└── Category

Orders

│

└── Order Items

```

Relationships

```

Category

↓

Products

↓

Images

↓

Specifications

```

---

# 12. Image Storage Architecture

Images are **never stored inside PostgreSQL**.

```

Admin Upload

↓

Backend

↓

Cloudflare R2

↓

Image URL

↓

PostgreSQL

```

Only metadata is stored.

---

# 13. Email Architecture

```

Order Created

↓

Email Service

↓

Template

↓

Resend

↓

Customer

```

Templates

- Order Confirmation
- Confirmed
- Ready for Collection
- Completed
- Cancelled

---

# 14. Module Boundaries

Every feature is independent.

```

Products

Categories

Brands

Orders

Customers

Authentication

Dashboard

Settings

Emails

Uploads

```

Modules communicate through services.

Direct database access between modules should be avoided.

---

# 15. Deployment Architecture

```

Internet

↓

Cloudflare

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

```

Everything runs on one VPS.

Future scaling is possible.

---

# 16. Scalability Strategy

Current Architecture

```

Next.js

↓

Fastify

↓

PostgreSQL

```

Phase 2

```

Redis

↓

Caching

```

Phase 3

```

Queue

↓

Background Jobs

```

Phase 4

```

Order Service

Inventory Service

Notification Service

```

Only split into microservices when business requirements justify it.

---

# 17. Error Handling Flow

```

Request

↓

Controller

↓

Service

↓

Validation

↓

Repository

↓

Error?

↓

Global Error Handler

↓

Standard API Response

```

Every error should return a consistent JSON structure.

Example

```json
{
  "success": false,
  "message": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

# 18. Logging Strategy

Every important operation should be logged.

Examples

- User Login
- Failed Login
- Product Created
- Product Updated
- Product Deleted
- Order Created
- Order Completed
- Admin Created
- Image Uploaded

Logs should include:

- Timestamp
- User ID
- Action
- IP Address
- Request ID

---

# 19. Design Principles

The project follows these engineering principles:

- Modular Monolith
- Feature-Based Development
- Separation of Concerns
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Type Safety
- API First Design
- Reusable Components
- Reusable Services
- Reusable Validation
- Shared Types
- Shared Configuration
- Clean Code
- Documentation Driven Development

---

# 20. Architecture Summary

The architecture is intentionally designed to:

- Keep deployment simple.
- Support future scalability.
- Minimize duplicated code.
- Encourage modular development.
- Make onboarding easier for new developers.
- Support future business expansion without major rewrites.

---

# Document Information

| Property      | Value              |
| ------------- | ------------------ |
| Document      | 02_ARCHITECTURE.md |
| Version       | 1.0.0              |
| Last Updated  | August 2026        |
| Maintained By | Mohammed Ansab K   |
