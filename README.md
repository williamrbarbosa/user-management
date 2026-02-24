# 🧑‍💼 User Management

A full-stack user management application built as a technical assessment, featuring a modern Next.js frontend, a NestJS REST API, JWT authentication, and end-to-end tests with Playwright — all orchestrated via Docker.

---

## 🧱 Tech Stack

### Frontend (`/web`)

- **Next.js 15+** — App Router, Server & Client Components
- **TypeScript 5+**
- **Tailwind CSS** — utility-first styling
- **React Hook Form + Zod** — form handling and schema validation
- **TanStack Query (React Query)** — server state management
- **Headless UI** — accessible modal and transition components
- **Playwright 1.50+** — end-to-end testing

### Backend (`/api`)

- **NestJS** — modular REST API
- **Prisma ORM** — type-safe database access
- **PostgreSQL 16** — relational database
- **Redis 7** — session/cache layer
- **JWT** — stateless authentication

### Infrastructure

- **Docker + Docker Compose** — fully containerized environment

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed
- Node.js 22+ (for local development outside containers)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/user-management.git
cd user-management
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
POSTGRES_DB=user_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
```

### 3. Start the containers

```bash
docker compose up --build
```

| Service  | URL                   |
| -------- | --------------------- |
| Web      | http://localhost:3001 |
| API      | http://localhost:3000 |
| Postgres | localhost:5433        |
| Redis    | localhost:6379        |

### 4. Seed the database

After the containers are running:

```bash
docker exec -it user-management-api npx prisma db seed
```

Default credentials after seeding:

| Name         | Email              | Password  |
| ------------ | ------------------ | --------- |
| System Admin | admin@company.com  | Admin@123 |
| John Doe     | john.doe@gmail.com | Admin@123 |
| Jane Doe     | jane.doe@gmail.com | Admin@123 |

---

## 📁 Project Structure

```
.
├── api/                  # NestJS backend
│   ├── prisma/           # Schema, migrations, seed
│   └── src/
│       ├── auth/         # JWT authentication
│       ├── users/        # Users module (CRUD)
│       └── common/       # Shared utilities
├── web/                  # Next.js frontend
│   └── src/
│       ├── app/          # App Router pages
│       ├── modules/      # Feature modules (users, auth)
│       ├── components/   # Reusable UI components
│       └── schemas/      # Zod validation schemas
├── docker/               # Dockerfiles
│   ├── api.Dockerfile
│   └── web.Dockerfile
└── docker-compose.yml
```

---

## 🔐 Authentication

Authentication is handled via **email and password**. On successful login, the API returns a **JWT token** which is stored client-side and sent on every subsequent request via the `Authorization: Bearer <token>` header.

Protected routes on the frontend redirect unauthenticated users to the login page.

---

## 📋 Features

- **Login** with email and password
- **List users** with pagination and sorting
- **Create** new users
- **Edit** existing users (name, email, status)
- **Delete** users (cannot delete your own account)
- **Status management** — Active / Inactive users
- **Form validation** with Zod schemas
- **Toast notifications** and global loading state

---

## 🧪 Running Tests

End-to-end tests are written with **Playwright**.

```bash
# Inside the web container or locally with Node 22+
cd web
npx playwright test
```

To run with UI mode:

```bash
npx playwright test --ui
```

---

## 🛠 Useful Commands

```bash
# Rebuild containers
docker compose up --build

# Stop containers
docker compose down

# View API logs
docker logs user-management-api -f

# Access Prisma Studio
docker exec -it user-management-api npx prisma studio

# Run migrations
docker exec -it user-management-api npx prisma migrate dev
```

---

## License

Proprietary - All right reserved to William Barbosa

---

**Version:** 1.0.0
**last Update:** Feb 2026
**Developed by:** William Barbosa
