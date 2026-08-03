# Samud Shabkat E-Commerce Ordering Platform

> **Version:** 1.0.0  
> **Project Type:** B2B E-Commerce Ordering Platform  
> **Author:** Mohammed Ansab K  
> **Status:** Planning Phase

---

# 1. Introduction

The **Samud Shabkat E-Commerce Ordering Platform** is a modern web application designed for IT hardware and technology product sales. The platform allows customers to browse products, search for items, add them to a shopping cart, and place orders online without requiring an online payment gateway.

Instead of online payments, customers complete the ordering process by selecting **Takeaway / Pay at Shop**, allowing the business to manage orders digitally while collecting payment in person.

The platform also includes a complete administration system for managing products, categories, brands, customers, orders, administrators, and overall business operations.

The architecture is designed with scalability in mind, allowing the business to expand into a full-featured e-commerce platform in the future.

---

# 2. Business Goals

The primary objectives of the platform are:

- Establish a professional online presence.
- Showcase IT hardware and technology products.
- Allow customers to browse products conveniently.
- Simplify the ordering process.
- Collect customer and company information.
- Centralize order management.
- Reduce manual communication.
- Improve operational efficiency.
- Build a scalable system for future growth.

---

# 3. Project Scope

The initial version of the platform includes:

- Product Catalog
- Product Details
- Category Browsing
- Brand Browsing
- Product Search
- Shopping Cart
- Customer Registration
- Customer Login
- Checkout
- Takeaway / Pay at Shop
- Order Placement
- Order Tracking (Admin)
- Product Management
- Category Management
- Brand Management
- Customer Management
- Order Management
- Payment Status Management
- Email Notifications
- Role Based Access Control
- Super Admin Dashboard
- Admin Dashboard

---

# 4. Target Users

The platform serves three primary user groups.

## Customer

Customers can:

- Browse products
- Search products
- View product details
- Add products to cart
- Register an account
- Login
- Place orders
- Receive email notifications

---

## Administrator

Administrators are responsible for daily business operations.

Responsibilities include:

- Product Management
- Category Management
- Brand Management
- Customer Management
- Order Management
- Payment Confirmation
- Website Content Management

---

## Super Administrator

Super Administrators have complete control over the platform.

Responsibilities include:

- Create Administrators
- Manage Roles
- Assign Permissions
- Manage Platform Settings
- Full Dashboard Access
- User Management

---

# 5. Business Workflow

The overall workflow of the system is illustrated below.

```

Customer
↓

Browse Products

↓

Search / Filter

↓

Product Details

↓

Add to Cart

↓

Register / Login

↓

Checkout

↓

Review Order

↓

Takeaway / Pay at Shop

↓

Order Created

↓

Admin Dashboard

↓

Admin Reviews Order

↓

Confirm Order

↓

Ready for Collection

↓

Customer Visits Shop

↓

Payment Received

↓

Order Completed

```

---

# 6. Core Modules

The application is divided into the following modules.

## Storefront

Public-facing customer website.

Includes:

- Home Page
- Product Catalog
- Product Details
- Search
- Categories
- Brands
- Shopping Cart
- Checkout
- Contact Page

---

## Authentication

Responsible for:

- Login
- Registration
- Password Security
- Session Management

---

## Customer Module

Responsible for:

- Customer Profile
- Company Information
- Addresses
- Order History

---

## Product Module

Responsible for:

- Products
- Categories
- Brands
- Specifications
- Images

---

## Order Module

Responsible for:

- Cart
- Checkout
- Order Creation
- Order Items
- Order Status
- Payment Status

---

## Administration Module

Responsible for:

- Dashboard
- Products
- Categories
- Brands
- Customers
- Orders
- Admin Users
- Settings

---

## Email Module

Responsible for sending:

- Order Confirmation
- Order Status Updates
- Collection Notifications
- Completion Notifications

---

# 7. Order Lifecycle

Every order passes through the following states.

```

PENDING

↓

CONFIRMED

↓

READY FOR COLLECTION

↓

COMPLETED

```

Cancelled orders may exit the workflow at any stage before completion.

```

PENDING
↓

CONFIRMED
↓

CANCELLED

```

Payment status is managed independently.

Possible payment states:

- Unpaid
- Paid

---

# 8. System Characteristics

The platform is designed to be:

- Responsive
- Secure
- Scalable
- Maintainable
- Modular
- Role Based
- Mobile Friendly
- SEO Friendly
- Easy to Extend

---

# 9. Project Architecture

The application follows a **Modular Monolith Architecture**.

```

Next.js Frontend

↓

REST API

↓

Fastify Backend

↓

PostgreSQL Database

↓

Cloudflare R2

↓

Email Service

```

The project is maintained as a **Monorepo** to encourage code sharing, consistency, and easier maintenance.

---

# 10. Key Features

### Customer

- Product Browsing
- Search
- Categories
- Brands
- Product Details
- Shopping Cart
- Checkout
- Customer Registration
- Customer Login
- Order Placement
- Email Notifications

---

### Admin

- Dashboard
- Product Management
- Category Management
- Brand Management
- Customer Management
- Order Management
- Payment Confirmation
- Website Content Management

---

### Super Admin

- Everything available to Admin
- Admin Management
- Role Management
- Permission Management
- Platform Configuration

---

# 11. Future Expansion

The architecture has been intentionally designed so additional features can be integrated without requiring major structural changes.

Planned future enhancements include:

- Online Payment Gateway
- Inventory Management
- Warehouse Management
- Customer Dashboard
- Wishlist
- Product Reviews
- Discount Coupons
- Promotions
- Multi-language Support
- Multi-currency Support
- ERP Integration
- Accounting Integration
- Mobile Application
- Advanced Reports
- Analytics Dashboard
- Push Notifications
- AI Product Recommendations

---

# 12. Development Principles

The project follows the following engineering principles.

- Clean Architecture
- Modular Design
- Feature-Based Development
- Separation of Concerns
- Reusable Components
- Type Safety
- API First Development
- Scalable Folder Structure
- Maintainable Codebase
- Documentation Driven Development

---

# 13. Success Criteria

The project will be considered successful when:

- Customers can browse products smoothly.
- Customers can place orders successfully.
- Administrators can manage the entire catalog.
- Orders are tracked efficiently.
- Email notifications work correctly.
- The application performs well on desktop and mobile.
- The codebase remains scalable for future development.

---

# Document Information

| Property      | Value                  |
| ------------- | ---------------------- |
| Document      | 00_PROJECT_OVERVIEW.md |
| Version       | 1.0.0                  |
| Last Updated  | August 2026            |
| Maintained By | Mohammed Ansab K       |
