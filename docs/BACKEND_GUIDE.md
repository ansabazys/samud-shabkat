# Backend Development Guide

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 09_BACKEND_GUIDE.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Backend Overview
2. Technology Stack
3. Backend Architecture
4. Project Structure
5. Module Architecture
6. Request Lifecycle
7. Plugin Architecture
8. Controller Layer
9. Service Layer
10. Repository Layer
11. Validation Layer
12. Authentication
13. Authorization
14. Database Layer
15. Error Handling
16. Logging
17. File Uploads
18. Email Service
19. Transactions
20. Configuration
21. API Standards
22. Coding Standards
23. Future Scalability

---

# 1. Backend Overview

The backend is built using **Fastify** with a **Modular Monolith Architecture**.

Responsibilities

- Authentication
- Authorization
- Product Management
- Category Management
- Brand Management
- Customer Management
- Order Management
- Image Upload
- Email Notifications
- Settings
- REST APIs

---

# 2. Technology Stack

Framework

- Fastify

Language

- TypeScript

ORM

- Drizzle ORM

Database

- PostgreSQL

Authentication

- JWT

Password Hashing

- Argon2

Validation

- Zod

Logging

- Pino

Storage

- Cloudflare R2

Email

- Resend

Documentation

- Swagger/OpenAPI

---

# 3. Backend Architecture

The backend follows a layered architecture.

```

HTTP Request

↓

Route

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

```

Each layer has a single responsibility.

---

# 4. Project Structure

```
apps/
└── api/
    │
    ├── src/
    │
    ├── plugins/
    ├── middleware/
    ├── modules/
    ├── common/
    ├── config/
    ├── utils/
    │
    ├── app.ts
    └── server.ts
```

---

# 5. Module Structure

Every business module follows the same structure.

```
products/

product.routes.ts

product.controller.ts

product.service.ts

product.repository.ts

product.schema.ts

product.types.ts

index.ts
```

The same pattern is used for:

- auth
- users
- categories
- brands
- orders
- customers
- settings
- uploads

---

# 6. Request Lifecycle

Every request follows the same lifecycle.

```
Client

↓

Fastify Route

↓

Authentication Middleware

↓

Permission Middleware

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Response

```

---

# 7. Fastify Plugins

Plugins are registered once during application startup.

Examples

```
jwt.ts

database.ts

swagger.ts

cors.ts

helmet.ts

multipart.ts

cookies.ts
```

Plugins should not contain business logic.

---

# 8. Controller Layer

Controllers are responsible for:

- Reading Request
- Calling Service
- Returning Response

Controllers should NOT

- Query Database
- Contain Business Logic
- Perform Complex Validation

Example

```
Request

↓

Controller

↓

Service

↓

Response
```

Controllers stay thin.

---

# 9. Service Layer

The Service Layer contains all business logic.

Examples

- Create Product
- Create Order
- Calculate Order Total
- Validate Business Rules
- Generate Order Number
- Send Email

Services may call multiple repositories.

---

# 10. Repository Layer

Repositories communicate with PostgreSQL.

Responsibilities

- CRUD Operations
- SQL Queries
- Pagination
- Filtering

Repositories should never contain business logic.

---

# 11. Validation Layer

Validation is performed using Zod.

Flow

```
Request

↓

Zod Schema

↓

Validated Data

↓

Controller
```

Validation happens before business logic.

---

# 12. Authentication

Authentication responsibilities

- Login
- Register
- Refresh Token
- Logout
- Password Hashing
- JWT Generation

Authentication Middleware

```
Request

↓

Verify JWT

↓

Attach User

↓

Continue
```

---

# 13. Authorization

Authorization uses permission-based RBAC.

```
JWT

↓

Load Permissions

↓

Permission Middleware

↓

Controller
```

Every protected endpoint declares the required permission.

Example

```
products.create

orders.update

customers.view
```

---

# 14. Database Layer

Drizzle ORM communicates with PostgreSQL.

Database package contains

```
schema/

relations/

migrations/

seed/
```

Repositories are the only layer allowed to query the database.

---

# 15. Transactions

Critical operations must use database transactions.

Example

Create Order

```
Create Order

↓

Create Order Items

↓

Save Snapshot

↓

Commit
```

Failure

```
Rollback
```

Never leave partial data.

---

# 16. Error Handling

All errors pass through a global error handler.

```
Request

↓

Error

↓

Global Error Handler

↓

JSON Response
```

Example

```json
{
  "success": false,
  "message": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

Never expose stack traces to clients.

---

# 17. Logging

Every important operation should be logged.

Examples

- Login
- Logout
- Product Created
- Product Updated
- Product Deleted
- Order Created
- Payment Confirmed
- Admin Created

Logs should include

- Timestamp
- User ID
- Request ID
- Action
- Status

---

# 18. File Uploads

Uploads follow this flow.

```
Admin

↓

Fastify

↓

Validation

↓

Cloudflare R2

↓

Database

```

Only image metadata is stored in PostgreSQL.

---

# 19. Email Service

Email responsibilities

- Order Confirmation
- Order Approved
- Ready for Collection
- Completed
- Cancelled

Structure

```
emails/

email.service.ts

templates/

providers/
```

Business modules call the Email Service.

---

# 20. Configuration

Configuration should never be hardcoded.

Use

```
config/

env.ts

constants.ts
```

Environment variables

```
DATABASE_URL

JWT_SECRET

R2_BUCKET

RESEND_API_KEY
```

---

# 21. API Standards

Every endpoint returns the same response format.

Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": []
}
```

---

# 22. Dependency Rules

Allowed

```
Controller

↓

Service

↓

Repository

↓

Database
```

Not Allowed

```
Controller

↓

Repository
```

Controllers must never bypass services.

---

# 23. Business Rules

Business logic belongs only inside Services.

Examples

✔ Calculate totals

✔ Validate order status

✔ Generate order numbers

✔ Send emails

✔ Check stock (future)

Not inside Controllers.

---

# 24. Utility Functions

Shared utilities

```
utils/

date.ts

currency.ts

slug.ts

jwt.ts

hash.ts
```

Utilities should remain stateless.

---

# 25. Constants

Examples

```
ORDER_STATUS

PAYMENT_STATUS

ROLES

PERMISSIONS

ERROR_CODES
```

Keep constants centralized.

---

# 26. Security Guidelines

- Validate every request
- Hash passwords
- Use HTTPS
- Verify JWT
- Protect admin APIs
- Never trust client input
- Sanitize uploaded files
- Limit upload size
- Rate-limit authentication endpoints

---

# 27. Performance Guidelines

- Use pagination
- Avoid N+1 queries
- Select only required columns
- Add indexes
- Use JSONB for specifications
- Keep queries optimized
- Batch database operations where appropriate

---

# 28. Future Scalability

Current Architecture

```
Next.js

↓

Fastify

↓

PostgreSQL
```

Future

```
Redis

↓

Queue

↓

Notification Worker

↓

Inventory Service

↓

Payment Service
```

The modular monolith can evolve into microservices if future business requirements justify it.

---

# 29. Development Workflow

When implementing a new feature:

1. Create database migration
2. Define Zod schema
3. Create repository
4. Implement service
5. Implement controller
6. Register routes
7. Write tests
8. Update API documentation

This workflow should be followed consistently.

---

# 30. Summary

The backend architecture is designed to provide:

- Clean separation of concerns
- High maintainability
- Strong type safety
- Modular feature development
- Secure authentication
- Permission-based authorization
- Scalable database access
- Consistent API responses

Following these conventions ensures the backend remains easy to extend, test, and maintain as the platform grows.

---

# Document Information

| Property      | Value               |
| ------------- | ------------------- |
| Document      | 09_BACKEND_GUIDE.md |
| Version       | 1.0.0               |
| Last Updated  | August 2026         |
| Maintained By | Mohammed Ansab K    |
