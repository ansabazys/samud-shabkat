# API Reference

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 05_API_REFERENCE.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. API Overview
2. API Standards
3. Authentication APIs
4. Product APIs
5. Category APIs
6. Brand APIs
7. Customer APIs
8. Order APIs
9. Dashboard APIs
10. Admin APIs
11. Settings APIs
12. Upload APIs
13. Response Format
14. Error Codes
15. Pagination
16. Versioning

---

# 1. API Overview

The backend exposes a RESTful API consumed by the Next.js frontend.

Base URL

```
/api/v1
```

Example

```
GET /api/v1/products
```

---

# 2. API Standards

## Request

```
GET
POST
PUT
PATCH
DELETE
```

---

## Content Type

```
application/json
```

---

## Authentication

```
Bearer Token
```

Authorization Header

```
Authorization: Bearer <access_token>
```

---

# 3. Authentication APIs

## Register

```
POST /auth/register
```

---

## Login

```
POST /auth/login
```

---

## Logout

```
POST /auth/logout
```

---

## Refresh Token

```
POST /auth/refresh
```

---

## Get Current User

```
GET /auth/me
```

---

# 4. Product APIs

## Get Products

```
GET /products
```

Supports

- Search
- Pagination
- Brand
- Category
- Featured

---

## Get Product

```
GET /products/:slug
```

---

## Create Product

```
POST /products
```

Admin Only

---

## Update Product

```
PATCH /products/:id
```

---

## Delete Product

```
DELETE /products/:id
```

Soft Delete

---

# 5. Category APIs

## Get Categories

```
GET /categories
```

---

## Create Category

```
POST /categories
```

---

## Update Category

```
PATCH /categories/:id
```

---

## Delete Category

```
DELETE /categories/:id
```

---

# 6. Brand APIs

## Get Brands

```
GET /brands
```

---

## Create Brand

```
POST /brands
```

---

## Update Brand

```
PATCH /brands/:id
```

---

## Delete Brand

```
DELETE /brands/:id
```

---

# 7. Customer APIs

## Customer Profile

```
GET /customers/me
```

---

## Update Profile

```
PATCH /customers/me
```

---

## Customer Orders

```
GET /customers/me/orders
```

---

# 8. Order APIs

## Create Order

```
POST /orders
```

---

## Get Order

```
GET /orders/:id
```

---

## Get My Orders

```
GET /orders/me
```

---

## Admin Orders

```
GET /admin/orders
```

Supports

- Status Filter
- Payment Filter
- Search
- Pagination

---

## Update Order Status

```
PATCH /admin/orders/:id/status
```

---

## Update Payment Status

```
PATCH /admin/orders/:id/payment
```

---

# 9. Dashboard APIs

## Dashboard Summary

```
GET /dashboard
```

Returns

- Total Products
- Total Customers
- Total Orders
- Pending Orders
- Completed Orders

---

## Recent Orders

```
GET /dashboard/recent-orders
```

---

# 10. Admin APIs

## List Admins

```
GET /admins
```

---

## Create Admin

```
POST /admins
```

Super Admin Only

---

## Update Admin

```
PATCH /admins/:id
```

---

## Delete Admin

```
DELETE /admins/:id
```

---

# 11. Settings APIs

```
GET /settings
PATCH /settings
```

Super Admin Only

---

# 12. Upload APIs

## Upload Product Images

```
POST /uploads/products
```

Returns

```
imageUrl
```

---

# 13. Standard API Response

Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# 14. Common Error Codes

```
400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error
```

---

# 15. Pagination

Query Parameters

```
?page=1
&limit=20
```

Response

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "totalPages": 13
  }
}
```

---

# 16. API Versioning

All endpoints are versioned.

```
/api/v1
```

Future versions

```
/api/v2
```

This ensures backward compatibility.

---

# API Design Principles

- RESTful Endpoints
- Consistent Responses
- Stateless Authentication
- Role-Based Access Control
- Pagination by Default
- Soft Deletes
- Validation on Every Request
- Thin Controllers
- Business Logic in Services
- Repository Pattern

---

# Document Information

| Property      | Value               |
| ------------- | ------------------- |
| Document      | 05_API_REFERENCE.md |
| Version       | 1.0.0               |
| Last Updated  | August 2026         |
| Maintained By | Mohammed Ansab K    |
