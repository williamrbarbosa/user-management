# User Management Platform – Backend API

This project is the backend API for the **User Management Platform**, a back-office user management system designed to manage users and sessions in a scalable, secure, and production-ready environment.

The API is built using **NestJS**, **TypeScript**, **PostgreSQL**, and **Redis**, following modern software engineering best practices, including modular architecture, automated testing, and containerized infrastructure.

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Main Principles](#main-principles)
4. [Local Setup](#local-setup)

---

## Tech Stack

- **Node.js 22+**
- **TypeScript 5+**
- **NestJS**
- **PostgreSQL**
- **Redis**
- **Prisma ORM**
- **Docker & Docker Compose**
- **Jest & Supertest (testing)**

---

## Architecture Overview

The application follows a modular and scalable architecture:
src/
├── modules/
│ ├── users/
│ ├── sessions/
│ └── auth/
├── common/
│ ├── guards/
│ ├── interceptors/
│ ├── filters/
│ └── logger/
├── prisma/
└── main.ts

### Main Principles

- Modular design for scalability
- Clean separation of concerns
- Domain-driven validations
- Centralized error handling
- Production-grade logging
- Fully containerized setup

---

## Local Setup

### Prerequisites

Make sure you have installed:

- Docker
- Docker Compose

---

### 1. Clone the repository

git clone https://github.com/williamrbarbosa/user-management
cd user-management-platform

### 2. Install dependecies

docker-compose exec api npm install

### 3. Generate database and seed data

docker-compose exec api npx prisma db push
docker-compose exec api npx prisma generate
docker-compose exec api npx prisma db seed

### 4. Start Application

docker-compose exec api npm run start

---

## License

Proprietary - All right reserved to William Barbosa

---

**Version:** 1.0.0
**last Update:** Feb 2026
**Developed by:** William Barbosa
