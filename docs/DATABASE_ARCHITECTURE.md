# Database Architecture

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 04_DATABASE_ARCHITECTURE.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Overview
2. Design Goals
3. Database Technology
4. Database Architecture
5. Database Modules
6. Entity Relationship Overview
7. Why JSONB?
8. Product Data Model
9. Images Strategy
10. Order Snapshot Strategy
11. Relationships
12. Naming Conventions
13. Primary Keys
14. Audit Columns
15. Soft Deletes
16. Indexing Strategy
17. Transactions
18. Migration Strategy
19. Seed Strategy
20. Backup Strategy
21. Future Expansion

---

# 1. Overview

The Samud Shabkat platform uses **PostgreSQL** as its primary relational database.

The application manages:

- Authentication
- Customers
- Product Catalog
- Orders
- Administration
- Platform Settings

The database is designed to support both the current ordering system and future expansion into a full-scale e-commerce platform.

---

# 2. Design Goals

The database is designed around the following principles:

- High Performance
- Strong Data Integrity
- Scalability
- Type Safety
- Easy Maintenance
- Flexible Product Specifications
- Future Expansion
- Minimal Data Duplication

---

# 3. Database Technology

## Database

PostgreSQL

---

## ORM

Drizzle ORM

---

## Driver

postgres

---

## Migration Tool

Drizzle Kit

---

## Primary Key Strategy

UUID

---

# 4. Database Architecture

The database is organized into logical business modules.

```
Authentication
│
├── Users
├── Roles
├── Permissions
├── User Roles
└── Role Permissions

Catalog
│
├── Categories
├── Brands
├── Products
└── Product Images

Customers
│
└── Customer Profiles

Orders
│
├── Orders
└── Order Items

Configuration
│
└── Settings
```

Every module is independent and communicates using foreign key relationships.

---

# 5. Database Modules

## Authentication Module

Responsible for:

- User Accounts
- Login
- Roles
- Permissions

Tables

- users
- roles
- permissions
- user_roles
- role_permissions

---

## Catalog Module

Responsible for:

- Products
- Categories
- Brands
- Images

Tables

- categories
- brands
- products
- product_images

---

## Customer Module

Responsible for:

- Company Information
- Customer Details

Tables

- customer_profiles

---

## Order Module

Responsible for:

- Orders
- Order Items

Tables

- orders
- order_items

---

## Configuration Module

Responsible for:

Platform configuration.

Tables

- settings

---

# 6. Entity Relationship Overview

```
Users
│
├── Customer Profile
│
├── Orders
│
└── User Roles

Roles
│
└── Permissions

Categories
│
└── Products

Brands
│
└── Products

Products
│
└── Product Images

Orders
│
└── Order Items
```

A detailed ERD will be documented separately.

---

# 7. Why JSONB?

The platform sells many different categories of IT hardware.

Examples:

- Laptop
- Desktop
- Monitor
- Router
- Printer
- UPS
- SSD
- NAS
- Switch
- Keyboard
- Mouse

Every category contains different technical specifications.

Examples

Laptop

```json
{
  "processor": "Intel Core Ultra 7",
  "ram": "32GB",
  "storage": "1TB SSD",
  "gpu": "RTX 4070"
}
```

Router

```json
{
  "wifi": "WiFi 6E",
  "ports": 8,
  "speed": "10Gbps"
}
```

Monitor

```json
{
  "panel": "IPS",
  "refresh_rate": "165Hz",
  "resolution": "2560x1440"
}
```

Creating separate relational columns for every specification would make the schema difficult to maintain.

Instead, the `products` table stores specifications inside a PostgreSQL **JSONB** column.

Advantages:

- Unlimited specifications
- No schema changes
- Supports every hardware category
- Easy frontend rendering
- PostgreSQL GIN indexing
- Excellent scalability

---

# 8. Product Data Model

Products are divided into two parts.

## Structured Data

Stored as regular columns.

Examples:

- Name
- SKU
- Slug
- Price
- Brand
- Category
- Status

These values are frequently searched and filtered.

---

## Dynamic Data

Stored inside JSONB.

Examples:

```json
{
  "processor": "Intel Core i7",
  "ram": "16GB",
  "storage": "512GB SSD",
  "display": "15.6 inch",
  "gpu": "RTX4060"
}
```

This allows unlimited hardware specifications without changing the database schema.

---

# 9. Product Images Strategy

Images are **never stored inside PostgreSQL**.

Only image metadata is stored.

```
Product

↓

Image Upload

↓

Cloudflare R2

↓

Image URL

↓

Database
```

The database stores:

- URL
- Storage Key
- Alt Text
- Sort Order
- Primary Image Flag

This keeps the database lightweight and improves performance.

---

# 10. Order Snapshot Strategy

Orders should preserve historical data.

Example

Today

```
Laptop

Price

₹85,000

RAM

16GB
```

Six months later

```
Price

₹92,000

RAM

32GB
```

Old orders must still display:

```
₹85,000

16GB
```

Therefore every order item stores a snapshot of:

- Product Name
- SKU
- Unit Price
- Specifications (JSONB)

Order history never depends on current product data.

---

# 11. Relationships

Core relationships include:

```
Category
    │
    └── Products

Brand
    │
    └── Products

Product
    │
    └── Images

User
    │
    ├── Customer Profile
    └── Orders

Order
    │
    └── Order Items
```

All relationships are enforced using foreign keys.

---

# 12. Naming Conventions

## Tables

Use plural snake_case.

Examples

```
users

customer_profiles

product_images

order_items
```

---

## Columns

Use snake_case.

Examples

```
created_at

updated_at

company_name

payment_status
```

---

## Foreign Keys

Always follow:

```
table_name_id
```

Examples

```
category_id

brand_id

product_id

order_id

user_id
```

---

# 13. Primary Keys

Every table uses UUID.

```
id UUID PRIMARY KEY
```

Reasons

- Globally unique
- Secure
- Better for distributed systems
- Prevents sequential ID guessing

---

# 14. Audit Columns

Every business table should include:

```
created_at

updated_at
```

Optional

```
created_by

updated_by
```

These fields support auditing and future reporting.

---

# 15. Soft Deletes

Business entities should use soft deletes.

```
deleted_at
```

Applicable tables:

- Products
- Categories
- Brands
- Customers

Orders should never be deleted.

Instead, order status changes should be tracked.

---

# 16. Indexing Strategy

Indexes should be added to frequently queried columns.

Examples

```
email

slug

sku

category_id

brand_id

created_at

order_number
```

JSONB fields should use GIN indexes.

Example

```
CREATE INDEX idx_products_specs
ON products
USING GIN(specifications);
```

This enables fast specification searches.

---

# 17. Transactions

Critical operations must execute inside transactions.

Examples

Order Creation

```
Create Order

↓

Create Order Items

↓

Commit
```

If any step fails:

```
Rollback
```

No partial data should remain.

---

# 18. Migration Strategy

All database changes must be managed using Drizzle migrations.

Workflow

```
Modify Schema

↓

Generate Migration

↓

Review

↓

Apply

↓

Commit
```

Production schema changes must never be made manually.

---

# 19. Seed Strategy

Development environments should include seed data.

Seed includes:

- Roles
- Permissions
- Super Admin
- Categories
- Brands
- Sample Products
- Settings

Seed scripts should be idempotent whenever possible.

---

# 20. Backup Strategy

Production backups should be automated.

Recommended:

- Daily backup
- 30-day retention
- Off-site storage

Backups should not be stored only on the application VPS.

---

# 21. Future Expansion

The architecture supports adding:

- Inventory
- Warehouses
- Suppliers
- Purchase Orders
- Coupons
- Reviews
- Wishlist
- Payment Gateway
- Shipping
- ERP Integration
- Analytics
- Multi-language
- Multi-currency

These features can be introduced without redesigning the core database.

---

# Summary

This database architecture is designed to provide:

- Strong data integrity
- High performance
- Flexible product specifications
- Clean relationships
- Easy maintenance
- Future scalability

The use of **JSONB for product specifications**, combined with structured relational data for searchable business attributes, provides the best balance between flexibility and performance for an IT hardware catalog.

---

# Document Information

| Property      | Value                       |
| ------------- | --------------------------- |
| Document      | 04_DATABASE_ARCHITECTURE.md |
| Version       | 1.0.0                       |
| Last Updated  | August 2026                 |
| Maintained By | Mohammed Ansab K            |
