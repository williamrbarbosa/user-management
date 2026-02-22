# User Management Platform – Backend API

This project is the backend API for the **User Management Platform**, a back-office user management system designed to manage users and sessions in a scalable, secure, and production-ready environment.

The API is built using **NestJS**, **TypeScript**, **PostgreSQL**, and **Redis**, following modern software engineering best practices, including modular architecture, automated testing, and containerized infrastructure.

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Main Principles](#main-principles)
3. [Local Setup](#local-setup)
4. [Instalacao e Configuracao](#instalacao-e-configuracao)
5. [Como Funciona](#como-funciona)
6. [Integracao via Embed (SDK)](#integracao-via-embed-sdk)
7. [Integracao via Iframe Direto](#integracao-via-iframe-direto)
8. [API Endpoints](#api-endpoints)
9. [Estrutura do Projeto](#estrutura-do-projeto)
10. [Modelo de Seguranca](#modelo-de-seguranca)
11. [Funcionalidades](#funcionalidades)
12. [Otimizacoes de Performance](#otimizacoes-de-performance)
13. [Deploy](#deploy)
14. [Troubleshooting](#troubleshooting)

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
