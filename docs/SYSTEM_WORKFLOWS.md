# System Workflows

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 10_SYSTEM_WORKFLOWS.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. System Overview
2. Customer Journey
3. Authentication Workflows
4. Product Workflows
5. Cart Workflows
6. Checkout Workflows
7. Order Workflows
8. Administration Workflows
9. Product Management
10. Category & Brand Management
11. Customer Management
12. Dashboard Workflows
13. Email Workflows
14. Image Upload Workflows
15. Error Workflows
16. Future Workflows

---

# 1. System Overview

The application consists of three user types.

```
Customer

↓

Administrator

↓

Super Administrator
```

Every workflow begins with one of these users.

---

# 2. Customer Journey

```
Landing Page

↓

Browse Products

↓

Search Products

↓

View Product Details

↓

Add To Cart

↓

Login / Register

↓

Checkout

↓

Review Order

↓

Takeaway / Pay at Shop

↓

Order Created

↓

Email Confirmation

↓

Wait for Admin

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

# 3. Registration Workflow

```
Customer

↓

Register

↓

Validate Input

↓

Email Available?

↓

NO

↓

Show Error

↓

YES

↓

Hash Password

↓

Create User

↓

Create Customer Profile

↓

Assign CUSTOMER Role

↓

Generate JWT

↓

Login Automatically

↓

Redirect Home
```

---

# 4. Login Workflow

```
Customer

↓

Login

↓

Validate Email

↓

Validate Password

↓

Load User

↓

Load Roles

↓

Load Permissions

↓

Generate JWT

↓

Generate Refresh Token

↓

Return User

↓

Dashboard / Homepage
```

---

# 5. Logout Workflow

```
Logout

↓

Invalidate Refresh Token

↓

Clear Session

↓

Redirect Login
```

---

# 6. Product Browsing Workflow

```
Homepage

↓

Products

↓

Apply Search

↓

Apply Category Filter

↓

Apply Brand Filter

↓

Pagination

↓

Product Details
```

---

# 7. Product Details Workflow

```
Open Product

↓

Load Product

↓

Load Images

↓

Load Specifications

↓

Display Product

↓

Add To Cart
```

---

# 8. Cart Workflow

```
Product

↓

Add To Cart

↓

Update Quantity

↓

Remove Product

↓

Calculate Total

↓

Checkout
```

Cart calculations happen on the frontend.

Final price validation happens on the backend.

---

# 9. Checkout Workflow

```
Checkout

↓

Customer Details

↓

Company Details

↓

Review Cart

↓

Validate Products

↓

Place Order
```

Backend

```
Receive Request

↓

Validate Products

↓

Read Latest Prices

↓

Calculate Totals

↓

Create Order

↓

Create Order Items

↓

Save Snapshot

↓

Commit Transaction

↓

Send Confirmation Email

↓

Return Order Number
```

---

# 10. Order Lifecycle

```
Pending

↓

Confirmed

↓

Ready For Collection

↓

Completed
```

Cancelled Orders

```
Pending

↓

Cancelled
```

Payment

```
Unpaid

↓

Paid
```

Order Status and Payment Status are independent.

---

# 11. Order Management Workflow

```
Admin

↓

Orders

↓

Open Order

↓

Review Details

↓

Update Status

↓

Send Email

↓

Save Changes
```

---

# 12. Product Creation Workflow

```
Admin

↓

Products

↓

Create Product

↓

Basic Information

↓

Category

↓

Brand

↓

Price

↓

Specifications

↓

Upload Images

↓

Save Product

↓

Database
```

---

# 13. Product Image Upload

```
Admin

↓

Select Images

↓

Backend

↓

Validate

↓

Cloudflare R2

↓

Store URL

↓

Database

↓

Return Success
```

---

# 14. Category Workflow

```
Admin

↓

Categories

↓

Create

↓

Save

↓

Available In Store
```

Update

```
Edit

↓

Save

↓

Updated
```

Delete

```
Soft Delete

↓

Hidden
```

---

# 15. Brand Workflow

```
Admin

↓

Brands

↓

Create

↓

Upload Logo

↓

Save

↓

Visible
```

---

# 16. Customer Management

```
Admin

↓

Customers

↓

Search

↓

View Profile

↓

View Orders

↓

View Company Information
```

Admins cannot change customer passwords.

---

# 17. Dashboard Workflow

```
Login

↓

Load Dashboard

↓

Load Statistics

↓

Load Recent Orders

↓

Load Products

↓

Render Widgets
```

Widgets load independently.

Failure of one widget should not break the dashboard.

---

# 18. Dashboard Statistics

```
Total Products

↓

Total Categories

↓

Total Brands

↓

Total Customers

↓

Pending Orders

↓

Completed Orders
```

---

# 19. Authentication Workflow

```
JWT

↓

Verify

↓

Load User

↓

Load Roles

↓

Load Permissions

↓

Continue
```

Unauthorized

```
401 Unauthorized
```

---

# 20. Permission Workflow

```
Request

↓

Permission Middleware

↓

Permission Exists?

↓

YES

↓

Continue

↓

NO

↓

403 Forbidden
```

---

# 21. Search Workflow

```
Search

↓

Products

↓

Category

↓

Brand

↓

Price

↓

Sort

↓

Paginate

↓

Results
```

---

# 22. Product Specification Workflow

Product Specifications use JSONB.

```
Create Product

↓

Specifications

↓

JSON

↓

Database

↓

Frontend

↓

Render Dynamic Table
```

Example

```
Processor

Intel Core Ultra 7

RAM

32GB

GPU

RTX 4070
```

Every product type may contain different specification keys.

---

# 23. Email Workflow

Order Created

```
Order

↓

Email Service

↓

Order Confirmation

↓

Customer
```

Status Updated

```
Admin

↓

Status Changed

↓

Email Service

↓

Customer
```

---

# 24. Error Workflow

Validation Error

```
Request

↓

Validation

↓

422 Response
```

Authentication Error

```
Request

↓

JWT

↓

401 Response
```

Permission Error

```
Permission Check

↓

403 Response
```

Unexpected Error

```
Global Error Handler

↓

500 Response
```

---

# 25. Image Workflow

```
Upload

↓

Validate

↓

Resize (Future)

↓

Cloudflare R2

↓

Save Metadata

↓

Return URL
```

---

# 26. Future Inventory Workflow

```
Order Completed

↓

Reduce Stock

↓

Update Inventory

↓

Low Stock Alert
```

Not included in Version 1.

---

# 27. Future Payment Workflow

```
Checkout

↓

Payment Gateway

↓

Payment Success

↓

Create Order

↓

Invoice

↓

Email
```

Version 1 uses **Takeaway / Pay at Shop** only.

---

# 28. Future ERP Workflow

```
Completed Order

↓

ERP

↓

Invoice

↓

Accounting

↓

Inventory
```

---

# 29. Workflow Design Principles

Every workflow follows these rules.

✅ Validate First

↓

✅ Authenticate

↓

✅ Authorize

↓

✅ Execute Business Logic

↓

✅ Save Database

↓

✅ Send Notification

↓

✅ Return Response

---

# 30. Summary

This document defines every major business workflow within the platform.

The workflows provide a clear implementation path for:

- Frontend Development
- Backend Development
- Testing
- Documentation
- Future Feature Expansion

All new features should follow these workflow conventions to ensure consistency throughout the application.

---

# Document Information

| Property      | Value                  |
| ------------- | ---------------------- |
| Document      | 10_SYSTEM_WORKFLOWS.md |
| Version       | 1.0.0                  |
| Last Updated  | August 2026            |
| Maintained By | Mohammed Ansab K       |
