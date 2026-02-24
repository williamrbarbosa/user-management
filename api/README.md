# 🛠️ User Management — API

Backend REST API of the user management application, built with **NestJS** and **TypeScript**. Handles authentication, user CRUD operations, and session management in a modular, scalable, and production-ready architecture.

---

## 🧱 Tech Stack

| Technology                  | Purpose                      |
| --------------------------- | ---------------------------- |
| **Node.js 22+**             | Runtime environment          |
| **TypeScript 5+**           | Static typing                |
| **NestJS**                  | Modular backend framework    |
| **Prisma ORM**              | Type-safe database access    |
| **PostgreSQL 16**           | Relational database          |
| **Redis 7**                 | Session and cache layer      |
| **JWT**                     | Stateless authentication     |
| **Jest + Supertest**        | Unit and integration testing |
| **Docker + Docker Compose** | Containerized infrastructure |
| **Swagger (OpenAPI)**       | API documentation            |

---

## 📁 Project Structure

```
src/
├── auth/                  # Authentication module (login, JWT strategy)
├── users/                 # Users module (CRUD, validations)
├── sessions/              # Session management
├── health/                # Health check endpoint
├── prisma/                # Prisma service and client setup
└── common/
    ├── decorators/        # Custom decorators (e.g. @User())
    ├── guards/            # Auth guards
    ├── models/            # Shared types and interfaces
    └── hash.service.ts    # Password hashing utility
```

---

## 🚀 Running Locally

> **Recommended:** use Docker Compose from the repository root to spin up all services together.
> See the [main README](../README.md) for full instructions.

To run the API in isolation:

### Prerequisites

- Node.js 22+
- PostgreSQL instance running
- Redis instance running

### Installation

```bash
cd api
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/user_management
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Database Setup

```bash
# Apply migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed initial data
npx prisma db seed
```

### Development

```bash
npm run start:dev
```

API running at: **http://localhost:3000**

---

## 🌱 Seed Data

After running the seed, the following users are available:

| Name         | Email              | Password  | Status |
| ------------ | ------------------ | --------- | ------ |
| System Admin | admin@company.com  | Admin@123 | Active |
| John Doe     | john.doe@gmail.com | Admin@123 | Active |
| Jane Doe     | jane.doe@gmail.com | Admin@123 | Active |

---

## 🔐 Authentication

Authentication is handled via **email and password**. On a successful login, the API returns a signed **JWT token** which must be sent on all protected requests:

```
Authorization: Bearer <token>
```

Protected endpoints return `401 Unauthorized` if the token is missing, expired, or invalid.

---

## 📋 API Endpoints

### Auth

| Method | Endpoint       | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | `/auth/login`  | Authenticate and receive a JWT token |
| POST   | `/auth/logout` | Invalidate the current session       |

### Users

| Method | Endpoint     | Description                |
| ------ | ------------ | -------------------------- |
| GET    | `/users`     | List all users (paginated) |
| GET    | `/users/:id` | Get a user by ID           |
| POST   | `/users`     | Create a new user          |
| PUT    | `/users/:id` | Update an existing user    |
| DELETE | `/users/:id` | Delete a user              |

> Full interactive documentation available at **http://localhost:3000/api** (Swagger UI).

---

## 🧪 Testing

Unit and integration tests are written with **Jest** and **Supertest**.

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test:cov

# Run in watch mode
npm run test:watch
```

---

## 🛠 Available Scripts

```bash
npm run start:dev    # Start in development mode (watch)
npm run start:prod   # Start in production mode
npm run build        # Compile TypeScript
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:cov     # Run tests with coverage
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma db seed   # Seed the database
```

---

## 📄 License

Proprietary — All rights reserved to William Barbosa.

---

**Version:** 1.0.0  
**Last Update:** Feb 2026  
**Developed by:** William Barbosa
