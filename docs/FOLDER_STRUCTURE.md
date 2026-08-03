# FOLDER_STRUCTURE.md

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Version:** 1.0.0

---

# Table of Contents

1. Folder Structure Philosophy
2. Monorepo Structure
3. Root Directory
4. Frontend Structure
5. Backend Structure
6. Shared Packages
7. Documentation
8. Naming Conventions
9. Feature Module Structure
10. File Naming Standards
11. Import Standards
12. Best Practices

---

# 1. Folder Structure Philosophy

This project follows a **Feature-Based Architecture** rather than a traditional "components" or "pages" architecture.

Every business feature owns its own:

- Components
- Hooks
- Services
- Types
- Validation
- Utilities

This keeps the project modular and easy to maintain as it grows.

---

# 2. Monorepo Structure

```text
samud-shabkat/
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── database/
│   ├── types/
│   ├── validation/
│   ├── ui/
│   └── config/
│
├── docs/
│
├── docker/
│
├── scripts/
│
├── .github/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# 3. Root Folder

## apps/

Contains all runnable applications.

```
apps/

web/
api/
```

Never place shared code here.

---

## packages/

Contains reusable code shared between applications.

```
database
types
validation
config
ui
```

Nothing inside packages should depend on apps.

---

## docs/

Project documentation.

Contains:

- Architecture
- API
- Database
- Deployment
- Roadmap

---

## docker/

Contains Docker related files.

Examples

```
nginx.conf

Dockerfile.web

Dockerfile.api
```

---

## scripts/

Automation scripts.

Examples

```
seed.ts

import-products.ts

backup.ts
```

---

# 4. Frontend Structure

```
apps/
└── web/
    │
    ├── public/
    │
    ├── src/
    │
    ├── package.json
    │
    └── next.config.ts
```

---

## src/

```
src/

app/

components/

features/

hooks/

lib/

services/

store/

styles/

types/

utils/

constants/

config/

middleware.ts
```

---

# app/

Contains App Router pages.

```
app/

(layouts)

(shop)

(auth)

(admin)

api/

globals.css
```

Only routing belongs here.

Never put business logic inside app/.

---

## Route Groups

```
(shop)

(auth)

(admin)
```

These organize routes without affecting URLs.

---

# Shop Routes

```
(shop)/

page.tsx

products/

categories/

brands/

cart/

checkout/

contact/

about/
```

---

# Auth Routes

```
(auth)/

login/

register/

forgot-password/

reset-password/
```

---

# Admin Routes

```
(admin)/

dashboard/

products/

categories/

brands/

customers/

orders/

admins/

settings/
```

Every admin page lives here.

---

# components/

Contains reusable UI components.

```
components/

ui/

layout/

forms/

navigation/

feedback/

tables/

charts/
```

---

## ui/

Pure reusable components.

Examples

```
button.tsx

card.tsx

input.tsx

dialog.tsx

badge.tsx
```

No business logic.

---

## layout/

Layout components.

Examples

```
navbar.tsx

sidebar.tsx

footer.tsx

admin-layout.tsx

shop-layout.tsx
```

---

## forms/

Reusable form components.

Examples

```
text-field.tsx

select-field.tsx

image-upload.tsx
```

---

## navigation/

Navigation components.

```
breadcrumbs

pagination

menu

sidebar
```

---

## feedback/

```
empty-state

loading

error

toast
```

---

# features/

Most important folder.

Every business feature owns itself.

```
features/

auth/

products/

categories/

brands/

cart/

checkout/

customers/

orders/

dashboard/

settings/
```

---

Example

```
products/

components/

hooks/

services/

types/

schemas/

utils/

api/
```

Products never access Cart code directly.

---

# hooks/

Global reusable hooks.

Examples

```
use-debounce

use-pagination

use-media-query

use-local-storage
```

---

# services/

Shared API client.

```
http.ts

auth.service.ts

upload.service.ts
```

Business-specific services stay inside features.

---

# store/

Global Zustand stores.

Examples

```
auth.store.ts

cart.store.ts

ui.store.ts
```

---

# styles/

```
globals.css

theme.css

variables.css
```

---

# lib/

Reusable libraries.

Examples

```
date.ts

currency.ts

cn.ts
```

---

# utils/

Generic helper functions.

Examples

```
slugify.ts

format-price.ts

truncate.ts
```

---

# constants/

```
routes.ts

roles.ts

permissions.ts
```

---

# config/

Application configuration.

```
env.ts

site.ts
```

---

# 5. Backend Structure

```
apps/
└── api/
    │
    ├── src/
    ├── package.json
    └── tsconfig.json
```

---

# src/

```
src/

server.ts

app.ts

plugins/

middleware/

modules/

common/

config/

utils/
```

---

# modules/

Every feature lives here.

```
auth/

users/

customers/

products/

categories/

brands/

orders/

uploads/

emails/

dashboard/

settings/
```

---

Example

```
products/

product.routes.ts

product.controller.ts

product.service.ts

product.repository.ts

product.schema.ts

product.types.ts
```

---

## Routes

Only register endpoints.

Never write business logic.

---

## Controller

Receives request.

Calls service.

Returns response.

---

## Service

Contains business logic.

This is where most code lives.

---

## Repository

Contains database queries only.

---

## Schema

Contains Zod validation.

---

## Types

Contains interfaces.

---

# plugins/

Fastify plugins.

Examples

```
jwt.ts

swagger.ts

database.ts

cors.ts
```

---

# middleware/

Authentication middleware.

Permission middleware.

Logging middleware.

---

# common/

Shared backend code.

```
errors/

responses/

constants/

enums/
```

---

# config/

```
env.ts

app.ts
```

---

# utils/

Helper functions.

```
hash.ts

jwt.ts

slug.ts
```

---

# 6. Shared Packages

## database/

```
schema/

relations/

migrations/

seed/

index.ts
```

---

## validation/

```
auth/

product/

order/

customer/
```

Shared Zod schemas.

---

## types/

```
user.ts

product.ts

order.ts

common.ts
```

---

## config/

```
constants.ts

permissions.ts

roles.ts
```

---

## ui/

Reusable design system.

Can later be published internally.

---

# 7. Documentation

```
docs/

00_PROJECT_OVERVIEW.md

01_TECH_STACK.md

02_ARCHITECTURE.md

03_FOLDER_STRUCTURE.md

04_DATABASE.md

05_API_REFERENCE.md

06_AUTHENTICATION.md

07_RBAC.md

08_FRONTEND_GUIDE.md

09_BACKEND_GUIDE.md

10_DEPLOYMENT.md

11_ROADMAP.md

12_CODING_STANDARDS.md

13_ENVIRONMENT.md

14_FEATURES.md

15_FUTURE_SCOPE.md
```

---

# 8. Naming Conventions

Folders

```
products

order-items

customer-profile
```

Use **kebab-case**.

---

Files

```
product.service.ts

product.controller.ts

auth.store.ts

cart-item.tsx
```

Use **kebab-case**.

---

React Components

```
ProductCard

ProductTable

OrderDetails

AdminSidebar
```

Use **PascalCase**.

---

Variables

```
productList

currentUser

orderTotal
```

Use **camelCase**.

---

Constants

```
MAX_PRODUCTS

DEFAULT_PAGE_SIZE
```

Use **UPPER_SNAKE_CASE**.

---

Enums

```
UserRole

OrderStatus

PaymentStatus
```

Use **PascalCase**.

---

# 9. Feature Module Structure

Every feature should follow the same layout.

Example:

```
products/

components/

hooks/

services/

types/

schemas/

utils/

api/

constants/

index.ts
```

Benefits

- Predictable
- Easy onboarding
- Easy testing
- Better scalability

---

# 10. Import Standards

Preferred

```ts
import { ProductCard } from "@/features/products/components/product-card";
```

Avoid

```ts
import "../../../components/product-card";
```

Always use path aliases.

---

# 11. Best Practices

✅ Feature-first architecture

✅ Keep components small

✅ No business logic inside UI components

✅ Controllers should stay thin

✅ Services contain business logic

✅ Repositories only access the database

✅ Shared validation through packages

✅ Shared types through packages

✅ Reusable UI components

✅ Avoid circular dependencies

---

# 12. Folder Ownership

| Folder     | Responsibility           |
| ---------- | ------------------------ |
| app        | Routing only             |
| components | Reusable UI              |
| features   | Business features        |
| hooks      | Shared hooks             |
| services   | Shared services          |
| store      | Zustand stores           |
| utils      | Generic helpers          |
| lib        | Shared libraries         |
| constants  | Constants & enums        |
| config     | App configuration        |
| modules    | Backend business modules |
| packages   | Shared code              |
| docs       | Documentation            |

---

# 13. Summary

This folder structure is designed to support:

- Large codebases
- Multiple developers
- Easy maintenance
- Feature isolation
- Reusability
- Scalability
- Clean architecture

Every new feature should follow the same structure and conventions to keep the project consistent over time.

---

# Document Information

| Property      | Value                  |
| ------------- | ---------------------- |
| Document      | 03_FOLDER_STRUCTURE.md |
| Version       | 1.0.0                  |
| Last Updated  | August 2026            |
| Maintained By | Mohammed Ansab K       |
