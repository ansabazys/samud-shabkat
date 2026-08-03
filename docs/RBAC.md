# Role Based Access Control (RBAC)

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 07_RBAC.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. RBAC Overview
2. Why Permission-Based Authorization?
3. RBAC Architecture
4. Roles
5. Permissions
6. Permission Naming Convention
7. Module Permissions
8. Role Permission Matrix
9. Backend Authorization Flow
10. Frontend Authorization Flow
11. Dashboard Rendering
12. Sidebar Rendering
13. API Protection
14. Route Protection
15. Future Expansion

---

# 1. RBAC Overview

The application uses **Role-Based Access Control (RBAC)** with **Permission-Based Authorization**.

Authentication determines **who the user is**.

Authorization determines **what the user can do**.

Authentication and Authorization are completely separate systems.

---

# 2. Why Permission-Based Authorization?

Instead of hardcoding roles inside the application, every action is protected using permissions.

❌ Bad

```ts
if (user.role === "ADMIN")
```

Problems

- Hard to maintain
- Doesn't scale
- Difficult to customize

---

✅ Good

```ts
hasPermission("products.create");
```

Benefits

- Flexible
- Easy to extend
- Fine-grained access control
- No hardcoded roles

---

# 3. RBAC Architecture

```
User

↓

Roles

↓

Permissions

↓

Authorization Middleware

↓

Controller

↓

Service
```

Every request follows this flow.

---

# 4. Roles

Version 1 includes three default roles.

```
SUPER_ADMIN

ADMIN

CUSTOMER
```

---

## SUPER_ADMIN

Full system access.

Responsibilities

- Manage Admins
- Manage Products
- Manage Categories
- Manage Brands
- Manage Orders
- Manage Customers
- Manage Settings
- Assign Roles
- Assign Permissions

---

## ADMIN

Business management.

Responsibilities

- Products
- Categories
- Brands
- Orders
- Customers

Cannot

- Create Super Admin
- Modify System Permissions
- Manage Platform Configuration

---

## CUSTOMER

Can only access customer features.

Examples

- Browse Products
- Cart
- Checkout
- View Orders
- Update Profile

---

# 5. Permissions

Permissions are grouped by module.

```
products.*

categories.*

brands.*

customers.*

orders.*

admins.*

settings.*

dashboard.*
```

---

# 6. Permission Naming Convention

Permissions follow

```
module.action
```

Examples

```
products.view

products.create

products.update

products.delete

orders.view

orders.update

customers.view

customers.update

dashboard.view

settings.update
```

This naming is consistent across the application.

---

# 7. Module Permissions

## Dashboard

```
dashboard.view
```

---

## Products

```
products.view

products.create

products.update

products.delete
```

---

## Categories

```
categories.view

categories.create

categories.update

categories.delete
```

---

## Brands

```
brands.view

brands.create

brands.update

brands.delete
```

---

## Customers

```
customers.view

customers.update
```

---

## Orders

```
orders.view

orders.update

orders.payment
```

---

## Admins

```
admins.view

admins.create

admins.update

admins.delete
```

---

## Settings

```
settings.view

settings.update
```

---

# 8. Role Permission Matrix

| Permission        | Super Admin | Admin | Customer   |
| ----------------- | ----------- | ----- | ---------- |
| dashboard.view    | ✅          | ✅    | ❌         |
| products.view     | ✅          | ✅    | ✅         |
| products.create   | ✅          | ✅    | ❌         |
| products.update   | ✅          | ✅    | ❌         |
| products.delete   | ✅          | ✅    | ❌         |
| categories.view   | ✅          | ✅    | ✅         |
| categories.create | ✅          | ✅    | ❌         |
| categories.update | ✅          | ✅    | ❌         |
| categories.delete | ✅          | ✅    | ❌         |
| brands.view       | ✅          | ✅    | ✅         |
| brands.create     | ✅          | ✅    | ❌         |
| brands.update     | ✅          | ✅    | ❌         |
| brands.delete     | ✅          | ✅    | ❌         |
| customers.view    | ✅          | ✅    | ❌         |
| customers.update  | ✅          | ✅    | Self Only  |
| orders.view       | ✅          | ✅    | Own Orders |
| orders.update     | ✅          | ✅    | ❌         |
| orders.payment    | ✅          | ✅    | ❌         |
| admins.view       | ✅          | ❌    | ❌         |
| admins.create     | ✅          | ❌    | ❌         |
| admins.update     | ✅          | ❌    | ❌         |
| admins.delete     | ✅          | ❌    | ❌         |
| settings.view     | ✅          | ❌    | ❌         |
| settings.update   | ✅          | ❌    | ❌         |

---

# 9. Backend Authorization Flow

Every protected request follows this flow.

```
Incoming Request

↓

JWT Authentication

↓

Load User

↓

Load Roles

↓

Load Permissions

↓

Permission Middleware

↓

Controller

↓

Service
```

Example

```
PATCH /products/123

↓

products.update

↓

Allowed
```

---

# 10. Frontend Authorization

The frontend never hardcodes roles.

Instead

```
User

↓

Permissions

↓

Render UI
```

Example

```tsx
if (can("products.create")) {
  return <AddProductButton />;
}
```

---

# 11. Dashboard Rendering

The dashboard is permission-driven.

Example

Super Admin

```
Dashboard

Products

Orders

Customers

Admins

Settings
```

Admin

```
Dashboard

Products

Orders

Customers
```

Customer

```
Shop

Orders

Profile
```

There is only **one dashboard application**.

Visibility changes based on permissions.

---

# 12. Sidebar Rendering

Sidebar items are permission-aware.

Example

```
Products

↓

products.view

↓

Visible
```

```
Settings

↓

settings.view

↓

Hidden
```

No duplicate sidebars are required.

---

# 13. API Protection

Every endpoint declares its required permission.

Example

```
POST /products

↓

products.create
```

```
DELETE /products/:id

↓

products.delete
```

Permission middleware validates access before reaching the controller.

---

# 14. Route Protection

Frontend

```
User

↓

Login

↓

Permissions

↓

Protected Route

↓

Render Page
```

Backend

```
JWT

↓

Permission Check

↓

Controller
```

Both layers enforce authorization.

---

# 15. Permission Middleware

Example flow

```
Request

↓

JWT Verify

↓

Load User

↓

Load Permissions

↓

Permission Exists?

↓

Yes

↓

Continue

↓

No

↓

403 Forbidden
```

Controllers should never perform manual permission checks.

---

# 16. Dynamic Permissions

Permissions are stored in the database.

This allows:

- Creating new roles
- Updating permissions
- Assigning permissions
- Revoking permissions

Without changing application code.

---

# 17. Future Expansion

Future versions can support additional roles.

Examples

```
Sales Manager

Sales Executive

Inventory Manager

Warehouse Manager

Support Agent

Marketing Manager

Accountant
```

Each role simply receives a different permission set.

No backend changes are required.

---

# 18. Best Practices

✅ Never hardcode roles

✅ Always check permissions

✅ Protect APIs on the backend

✅ Hide unauthorized UI

✅ Keep permission names consistent

✅ Store permissions in the database

✅ Use middleware for authorization

✅ Keep controllers free of permission logic

---

# 19. Summary

The platform uses a scalable permission-based RBAC system.

Key characteristics:

- JWT Authentication
- Permission-Based Authorization
- Dynamic Roles
- Database-Driven Permissions
- Backend Middleware Protection
- Frontend Conditional Rendering
- Single Dashboard with Dynamic Navigation

This architecture allows the application to grow without requiring changes to authorization logic whenever new roles or business requirements are introduced.

---

# Document Information

| Property      | Value            |
| ------------- | ---------------- |
| Document      | 07_RBAC.md       |
| Version       | 1.0.0            |
| Last Updated  | August 2026      |
| Maintained By | Mohammed Ansab K |
