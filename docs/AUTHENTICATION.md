# Authentication

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 06_AUTHENTICATION.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Authentication Overview
2. Authentication Flow
3. User Types
4. JWT Strategy
5. Password Security
6. Login Flow
7. Registration Flow
8. Refresh Token Flow
9. Logout Flow
10. Protected Routes
11. Route Guards
12. Session Management
13. Security Best Practices
14. Authentication Architecture

---

# 1. Authentication Overview

The platform uses **JWT-based Authentication**.

Authentication is responsible for:

- User Registration
- User Login
- User Logout
- Session Management
- Protected Routes
- Token Refresh
- Identity Verification

The authentication system is completely separate from authorization (RBAC).

---

# 2. User Types

The platform supports three user types.

```
Customer

↓

Administrator

↓

Super Administrator
```

Each user logs in through the same authentication system.

Permissions determine what they can access after login.

---

# 3. Authentication Flow

```
Register

↓

Validate Request

↓

Hash Password

↓

Create User

↓

Create Customer Profile

↓

Return Success
```

---

Login Flow

```
User

↓

Email + Password

↓

Validate Credentials

↓

Generate Access Token

↓

Generate Refresh Token

↓

Store Refresh Token

↓

Return Access Token

↓

Authenticated
```

---

# 4. JWT Strategy

Two tokens are used.

## Access Token

Purpose

Authenticate API requests.

Lifetime

```
15 Minutes
```

Contains

```
User ID

Email

Role

Permissions Version
```

---

## Refresh Token

Purpose

Generate a new Access Token.

Lifetime

```
30 Days
```

Stored securely.

---

# 5. Password Security

Passwords are never stored directly.

Workflow

```
Password

↓

Argon2 Hash

↓

Database
```

During Login

```
Password

↓

Argon2 Verify

↓

Success / Failure
```

---

# 6. Registration Flow

Customer Registration

```
Register

↓

Validate Input

↓

Check Email Exists

↓

Hash Password

↓

Create User

↓

Create Customer Profile

↓

Send Welcome Email

↓

Success
```

Default Role

```
CUSTOMER
```

Only Super Admin can create Administrators.

---

# 7. Login Flow

```
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

Return Tokens
```

Response

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {}
}
```

---

# 8. Refresh Token Flow

When Access Token expires

```
Client

↓

Refresh Token

↓

Validate

↓

Generate New Access Token

↓

Return New Token
```

If Refresh Token is invalid

```
Logout

↓

Login Again
```

---

# 9. Logout Flow

```
Logout

↓

Invalidate Refresh Token

↓

Remove Cookie

↓

Success
```

After logout

Access Token becomes unusable.

---

# 10. Protected Routes

Protected APIs require authentication.

Examples

```
/admin/products

/admin/orders

/dashboard

/customers/me

/orders
```

Public APIs

```
/products

/categories

/brands

/login

/register

/contact
```

---

# 11. Route Guards

Frontend Route Guard

```
Page

↓

Has Token?

↓

No

↓

Redirect Login

↓

Yes

↓

Continue
```

Backend Route Guard

```
Request

↓

JWT Middleware

↓

Verify Token

↓

Load User

↓

Continue
```

---

# 12. Session Management

The frontend stores

- Access Token
- User Information

Refresh Token should be stored securely.

The application automatically refreshes expired access tokens.

---

# 13. Authentication Middleware

Every protected request passes through:

```
Request

↓

JWT Verify

↓

Load User

↓

Attach User

↓

Next Middleware

↓

Controller
```

Controllers should never manually verify tokens.

---

# 14. Login Attempt Validation

The backend validates:

- Email Exists
- Password Correct
- User Active
- User Not Deleted

Only then authentication succeeds.

---

# 15. Password Rules

Minimum

```
8 Characters
```

Recommended

- Uppercase
- Lowercase
- Number
- Special Character

Passwords are validated before hashing.

---

# 16. Email Verification (Future)

Future versions may require:

```
Register

↓

Verification Email

↓

Activate Account

↓

Login
```

Not required for Version 1.

---

# 17. Forgot Password (Future)

Future workflow

```
Forgot Password

↓

Email Link

↓

Reset Token

↓

New Password

↓

Login
```

---

# 18. Security Best Practices

- Hash passwords using Argon2
- Never store plain passwords
- Short-lived access tokens
- Refresh token rotation
- HTTPS only
- Validate every request
- Never trust frontend validation
- Invalidate tokens after logout
- Protect all admin routes

---

# 19. Authentication Architecture

```
Client

↓

Login

↓

Fastify API

↓

Validate User

↓

Argon2 Verify

↓

Generate JWT

↓

Generate Refresh Token

↓

Database

↓

Client Authenticated
```

---

# 20. Responsibilities

## Authentication Module

Responsible for

- Login
- Register
- Logout
- Refresh Token
- Password Hashing
- JWT Generation
- User Identity

Not responsible for

- Permissions
- Roles
- Business Logic

Those belong to the Authorization (RBAC) module.

---

# 21. Folder Structure

```
modules/

auth/

auth.routes.ts

auth.controller.ts

auth.service.ts

auth.repository.ts

auth.schema.ts

auth.types.ts

jwt.service.ts

password.service.ts

token.service.ts
```

---

# 22. Summary

The authentication system is designed to provide:

- Secure login
- Secure registration
- JWT authentication
- Refresh token support
- Protected APIs
- Clean separation from authorization
- Future scalability

---

# Document Information

| Property      | Value                |
| ------------- | -------------------- |
| Document      | 06_AUTHENTICATION.md |
| Version       | 1.0.0                |
| Last Updated  | August 2026          |
| Maintained By | Mohammed Ansab K     |
