# Frontend Development Guide

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 08_FRONTEND_GUIDE.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Frontend Overview
2. Technology Stack
3. Project Structure
4. Application Layers
5. Routing Strategy
6. Feature-Based Architecture
7. Components
8. State Management
9. API Layer
10. Forms
11. Authentication Flow
12. Dashboard Architecture
13. Error Handling
14. Loading Strategy
15. Best Practices

---

# 1. Frontend Overview

The frontend is built using **Next.js App Router**.

The application contains three major areas:

- Public Store
- Authentication
- Administration

There is **one frontend application**.

Different dashboards are rendered based on permissions.

---

# 2. Technology Stack

Framework

- Next.js

Language

- TypeScript

Styling

- Tailwind CSS

UI Components

- shadcn/ui

Icons

- Lucide React

Forms

- React Hook Form

Validation

- Zod

Server State

- TanStack Query

Client State

- Zustand

Notifications

- Sonner

---

# 3. Project Structure

```

src/

app/

components/

features/

hooks/

services/

store/

styles/

utils/

constants/

config/

types/

lib/

```

---

# 4. Application Layers

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

Every layer has a single responsibility.

---

# 5. Routing Strategy

Public Routes

```

/

products

products/[slug]

categories/[slug]

brands/[slug]

about

contact

```

---

Authentication Routes

```

login

register

forgot-password

reset-password

```

---

Protected Customer Routes

```

profile

orders

```

---

Protected Admin Routes

```

admin/dashboard

admin/products

admin/categories

admin/brands

admin/orders

admin/customers

admin/admins

admin/settings

```

---

# 6. Feature-Based Architecture

Every business feature owns itself.

Example

```

features/

products/

components/

hooks/

services/

schemas/

types/

utils/

api/

```

The same structure applies to:

- Auth
- Orders
- Customers
- Dashboard
- Checkout
- Cart

---

# 7. Shared Components

Reusable UI components belong inside

```

components/

```

Examples

```

Button

Input

Card

Badge

Table

Dialog

Modal

Sheet

Dropdown

Avatar

```

Business-specific components should stay inside their feature.

---

# 8. Layout Components

```

components/layout/

```

Contains

- Navbar
- Footer
- Sidebar
- Admin Layout
- Shop Layout
- Breadcrumbs

---

# 9. State Management

The frontend uses different state managers based on responsibility.

---

## Zustand

Used for global client state.

Examples

```

User

Theme

Cart

Sidebar

Notifications

```

---

## TanStack Query

Used for server state.

Examples

```

Products

Orders

Customers

Dashboard

Settings

```

Never store API responses in Zustand.

---

## React State

Used for local component state.

```

Dialog Open

Dropdown

Selected Tab

Accordion

```

---

# 10. API Layer

All HTTP requests go through one shared API client.

```

services/

http.ts

```

Feature services

```

features/products/api/

features/orders/api/

features/customers/api/

```

Pages never call fetch() directly.

---

# 11. Forms

Every form follows the same structure.

```

React Hook Form

↓

Zod Validation

↓

Submit

↓

API

↓

Response

```

Examples

- Login
- Register
- Product Form
- Category Form
- Brand Form
- Checkout

---

# 12. Authentication Flow

```

Login

↓

Store Tokens

↓

Load User

↓

Load Permissions

↓

Redirect

```

Public pages remain accessible without login.

Protected pages require authentication.

---

# 13. Permission-Based Rendering

Never check roles directly.

Wrong

```tsx
if (user.role === "ADMIN")
```

Correct

```tsx
if (can("products.create"))
```

Every UI element should respect permissions.

Examples

- Buttons
- Menu Items
- Pages
- Actions
- Tables

---

# 14. Dashboard Architecture

The dashboard consists of reusable modules.

```

Dashboard

│

├── Statistics

├── Charts

├── Recent Orders

├── Recent Customers

└── Quick Actions

```

Each widget is an independent component.

---

# 15. Product Module

Responsibilities

- Product Listing
- Product Details
- Search
- Filters
- Pagination
- Product Cards

Components

```

ProductCard

ProductGrid

ProductTable

ProductGallery

ProductSpecifications

ProductSearch

ProductFilters

```

---

# 16. Cart Module

Responsibilities

- Add Product
- Remove Product
- Update Quantity
- Calculate Totals

Stored in Zustand.

---

# 17. Checkout Module

Responsibilities

- Customer Details
- Company Details
- Order Review
- Place Order

No payment gateway in Version 1.

---

# 18. Admin Module

Contains

- Dashboard
- Products
- Categories
- Brands
- Orders
- Customers
- Admins
- Settings

Every page follows the same layout.

---

# 19. Error Handling

API errors should display user-friendly messages.

Examples

```

Product Not Found

Validation Failed

Unauthorized

Server Error

```

Never expose backend errors directly.

---

# 20. Loading Strategy

Use skeleton loaders instead of spinners whenever possible.

Examples

- Product Cards
- Dashboard Cards
- Tables
- Orders

---

# 21. Empty States

Every list should have an empty state.

Examples

```

No Products Found

No Orders Yet

No Customers

```

---

# 22. Notifications

Use toast notifications for user feedback.

Examples

```

Product Created

Order Placed

Profile Updated

Image Uploaded

```

---

# 23. Image Strategy

Images are served from Cloudflare R2.

Use Next.js Image component.

Always define

- width
- height
- alt

Enable optimization.

---

# 24. Responsive Design

Support

Desktop

Tablet

Mobile

Breakpoints should follow Tailwind defaults.

The admin dashboard should remain usable on tablets.

---

# 25. Performance Guidelines

- Lazy load large components
- Use dynamic imports
- Optimize images
- Memoize expensive components
- Paginate large lists
- Avoid unnecessary re-renders

---

# 26. Accessibility

Follow WCAG best practices.

Examples

- Semantic HTML
- Keyboard Navigation
- Focus States
- ARIA Labels
- Color Contrast

---

# 27. Coding Standards

- Feature-first architecture
- Reusable components
- Strong typing
- Small components
- No duplicated logic
- Path aliases
- Consistent naming
- Business logic inside features

---

# 28. Summary

The frontend architecture is designed to provide:

- Fast performance
- Clean structure
- Scalable feature modules
- Reusable components
- Strong type safety
- Easy maintenance
- Permission-driven UI
- Responsive experience

This architecture supports both the current project scope and future expansion without requiring major structural changes.

---

# Document Information

| Property      | Value                |
| ------------- | -------------------- |
| Document      | 08_FRONTEND_GUIDE.md |
| Version       | 1.0.0                |
| Last Updated  | August 2026          |
| Maintained By | Mohammed Ansab K     |
