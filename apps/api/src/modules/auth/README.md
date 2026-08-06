# Authentication Module (`@samud/api/modules/auth`)

An enterprise-grade, feature-based authentication module implementing JWT strategy with Argon2 password cryptographic hashing.

---

## Purpose

Provides secure identity management, access authorization tokens, and user account provisioning without coupling internal authentication complexity to business logic or RBAC authorization rules.

## Responsibilities

- **User Provisioning**: Secure customer registration with transactional database defaults.
- **Identity Verification**: Email and Argon2id password verification during login attempts.
- **Token Lifecycle**: Issuance and validation of short-lived **15-minute** Access Tokens and long-lived **30-day** Refresh Tokens.
- **Session Security**: Automated refresh token rotation upon renewal and immediate revocation upon logout.
- **Route Protection**: Exposes standard Fastify preHandler middleware (`authenticate`) to protect API endpoints across domains.

---

## Folder Structure

```
modules/
└── auth/
    ├── controllers/        # HTTP controllers bridging Fastify requests/replies and service logic
    ├── services/           # Domain business logic and cryptographic utilities (jwt, password, token, auth)
    ├── repositories/       # Drizzle ORM PostgreSQL data access and transaction boundaries
    ├── schemas/            # Zod validation schemas enforcing structural data integrity
    ├── types/              # TypeScript interface definitions for domain payloads and models
    ├── routes/             # Fastify route registrations (/register, /login, /refresh, /logout)
    ├── middleware/         # Auth preHandler guarding protected endpoints with JWT verification
    ├── constants/          # Domain magic strings, cryptographic constraints, and cookie configs
    ├── utils/              # Helper utilities for safe database handling and profile formatting
    ├── index.ts            # Public domain API barrel export
    └── README.md           # Module documentation
```

---

## Public API (`index.ts`)

Other modules within the platform should rely exclusively on the barrel exports in `modules/auth/index.ts`:

- **`authRoutes`**: Fastify plugin function registering domain endpoints.
- **`authenticate`**: Fastify preHandler middleware for securing protected routes.
- **Types**: `UserResponse`, `AuthResponse`, and `AuthTokens`.
  _Internal repository layers, Zod schemas, and internal service implementations remain strictly encapsulated._

---

## Dependencies

- **`@samud/database`**: Shared workspace Drizzle ORM client and schemas (`users`, `roles`, `user_roles`, `customer_profiles`).
- **`@samud/config`**: Workspace constants containing RBAC role definitions (`ROLES`).
- **`argon2`**: Cryptographic password hashing engine.
- **`@fastify/jwt` & `@fastify/cookie`**: Token generation and HTTP-only session cookie management.
- **`zod`**: Schema validation.

---

## Operational Flow

1. **Registration**: Client sends `POST /register` -> Zod validation (`auth.schema.ts`) -> Duplicate email check -> Argon2 hashing -> Transactional user + customer profile creation in Postgres.
2. **Login**: Client sends `POST /login` -> Validate credentials -> Verify Argon2id password -> Generate 15-minute JWT Access Token & 30-day random hex Refresh Token -> Persist Refresh Token -> Return tokens and attach secure HTTP-only cookie.
3. **Token Renewal**: Client sends `POST /refresh` (with cookie or body token) -> Validate against stored token in Postgres -> Generate new access token and rotate refresh token.
4. **Protected Access**: External domain endpoint attaches `authenticate` preHandler -> Verifies Bearer token header -> Attaches decoded profile to `request.user`.
