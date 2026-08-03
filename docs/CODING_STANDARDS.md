# Coding Standards

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 14_CODING_STANDARDS.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Overview
2. General Principles
3. TypeScript Standards
4. Naming Conventions
5. Folder Standards
6. React Standards
7. Fastify Standards
8. Database Standards
9. API Standards
10. Error Handling
11. Logging
12. Git Workflow
13. Branch Strategy
14. Commit Convention
15. Pull Requests
16. Code Reviews
17. Performance Guidelines
18. Security Guidelines
19. Testing Standards
20. Documentation Standards

---

# 1. Overview

This document defines the coding standards for the project.

Goals

- Consistency
- Maintainability
- Scalability
- Readability
- Type Safety

Every developer working on the project should follow these standards.

---

# 2. General Principles

Always follow

- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Separation of Concerns
- Composition over Inheritance

---

# 3. TypeScript Standards

Always enable

```
strict: true
```

Never use

```ts
any;
```

Prefer

```ts
unknown;
```

Always create interfaces/types for data.

Example

```ts
interface Product {
  id: string;
  name: string;
}
```

---

# 4. Naming Conventions

## Files

Use kebab-case.

```
product-card.tsx

auth.service.ts

order.repository.ts
```

---

## Components

Use PascalCase.

```
ProductCard

OrderTable

CustomerForm
```

---

## Variables

Use camelCase.

```
currentUser

productList

orderTotal
```

---

## Constants

Use UPPER_SNAKE_CASE.

```
DEFAULT_PAGE_SIZE

MAX_UPLOAD_SIZE
```

---

## Enums

Use PascalCase.

```
OrderStatus

PaymentStatus

UserRole
```

---

# 5. Folder Standards

Use feature-based architecture.

Correct

```
features/

products/

orders/

customers/
```

Avoid

```
components/

pages/

services/

utils/

everything mixed together
```

Each feature owns its own logic.

---

# 6. React Standards

Prefer

Functional Components

Example

```tsx
export function ProductCard() {}
```

Avoid Class Components.

---

Keep components small.

Good

```
ProductCard

ProductPrice

ProductImage
```

Avoid

```
ProductEverything.tsx
```

---

Pages should contain minimal logic.

Business logic belongs inside hooks or services.

---

# 7. Fastify Standards

Layer order

```
Route

↓

Controller

↓

Service

↓

Repository
```

Controllers

✔ Read request

✔ Return response

Controllers should NOT

- Query database
- Calculate totals
- Send emails

---

Services

Contain all business logic.

---

Repositories

Only communicate with PostgreSQL.

---

# 8. Database Standards

Use Drizzle ORM.

Never write raw SQL unless necessary.

Use UUIDs.

Use snake_case column names.

Store timestamps as UTC.

Use JSONB only for flexible product specifications.

---

# 9. API Standards

RESTful endpoints.

Correct

```
GET /products

POST /products

PATCH /products/:id

DELETE /products/:id
```

Avoid verbs in URLs.

Incorrect

```
POST /createProduct
```

---

# 10. Response Format

Success

```json
{
  "success": true,
  "message": "Product created.",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

Use the same format everywhere.

---

# 11. Error Handling

Use centralized error handling.

Never

```ts
throw "Error";
```

Always

```ts
throw new AppError(...)
```

Use meaningful error codes.

Examples

```
PRODUCT_NOT_FOUND

ORDER_NOT_FOUND

UNAUTHORIZED
```

---

# 12. Logging

Log

- Login
- Logout
- Product Creation
- Product Update
- Product Delete
- Order Creation
- Payment Confirmation
- Admin Creation

Never log

- Passwords
- Tokens
- Secrets
- Credit Card Data

---

# 13. Git Workflow

Feature branches only.

```
main

↓

develop

↓

feature/*
```

Never develop directly on `main`.

---

# 14. Branch Naming

Examples

```
feature/product-management

feature/order-module

feature/authentication

fix/login-error

hotfix/payment-status

docs/api-reference
```

---

# 15. Commit Convention

Use Conventional Commits.

Examples

```
feat(products): add product management

fix(auth): resolve refresh token bug

refactor(order): simplify order service

docs(api): update authentication guide

style(ui): improve dashboard spacing

test(products): add repository tests

chore(deps): update dependencies
```

---

# 16. Pull Requests

Every PR should

- Build Successfully
- Pass Linting
- Pass Tests
- Include Description
- Reference Related Issue (if any)

Avoid large PRs.

---

# 17. Code Review Checklist

Review

- Naming
- Architecture
- Type Safety
- Error Handling
- Performance
- Security
- Tests
- Documentation

Do not approve code that violates project standards.

---

# 18. Performance Guidelines

Frontend

- Lazy load pages
- Use Next.js Image
- Memoize expensive components
- Paginate large datasets

Backend

- Avoid N+1 queries
- Select only required columns
- Use indexes
- Use transactions
- Keep queries efficient

---

# 19. Security Guidelines

Always

- Validate input
- Hash passwords
- Verify JWT
- Check permissions
- Sanitize uploads
- Use HTTPS
- Store secrets in environment variables

Never

- Trust client input
- Store plain passwords
- Expose stack traces
- Commit `.env` files

---

# 20. Testing Standards

Test

- Services
- Repositories
- Validation
- API Endpoints
- Authentication
- Authorization

Focus on business logic rather than framework internals.

---

# 21. Documentation Standards

Every major feature should include

- Overview
- API Changes
- Database Changes
- Configuration Changes

Keep documentation updated alongside code.

---

# 22. Code Organization Checklist

Before merging code, verify:

- Correct folder
- Correct naming
- Type-safe
- Linted
- Tested
- Documented
- No duplicated logic
- Uses shared utilities where appropriate

---

# 23. Summary

Following these coding standards ensures:

- Consistent architecture
- Readable code
- Easier onboarding
- Better maintainability
- Fewer bugs
- Scalable development

These standards should be followed throughout the lifetime of the project.

---

# Document Information

| Property      | Value                  |
| ------------- | ---------------------- |
| Document      | 14_CODING_STANDARDS.md |
| Version       | 1.0.0                  |
| Last Updated  | August 2026            |
| Maintained By | Mohammed Ansab K       |
