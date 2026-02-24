# 🖥️ User Management — Web

Frontend of the user management application, built with **Next.js 15** and **TypeScript**. Consumes the [REST API](../api) for authentication and CRUD operations.

---

## 🧱 Tech Stack

| Technology           | Purpose                                     |
| -------------------- | ------------------------------------------- |
| **Next.js 15+**      | React framework with App Router             |
| **TypeScript 5+**    | Static typing                               |
| **Tailwind CSS**     | Utility-first styling                       |
| **React Hook Form**  | Form state management                       |
| **Zod**              | Schema validation                           |
| **TanStack Query**   | Server state management                     |
| **Headless UI**      | Accessible components (modals, transitions) |
| **Heroicons**        | Icons                                       |
| **Playwright 1.50+** | End-to-end testing                          |

---

## 📁 Project Structure

```
src/
├── app/                   # App Router (pages and layouts)
│   ├── (public)/          # Public routes (login)
│   └── (private)/         # Protected routes (dashboard)
├── components/            # Reusable UI components
│   ├── form/              # Input, Select, Label, etc.
│   └── ui/                # Tag, Loader, Toast, etc.
├── modules/               # Feature modules
│   ├── auth/              # Login, hooks and auth service
│   └── users/             # List, modals, hooks and users service
├── schemas/               # Zod validation schemas
├── store/                 # Global state (Zustand)
└── helpers/               # Utilities and helper functions
```

---

## 🚀 Running Locally

> **Recommended:** use Docker Compose from the repository root to spin up all services together.
> See the [main README](../README.md) for full instructions.

To run the frontend in isolation:

### Prerequisites

- Node.js 22+
- API running at `http://localhost:3000`

### Installation

```bash
cd web
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Access at: **http://localhost:3001**

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Authentication

The authentication flow works as follows:

1. User submits email and password on the login form
2. The API returns a **JWT token**
3. The token is stored and sent on every request via the `Authorization: Bearer <token>` header
4. Protected routes redirect to `/login` if the token is invalid or missing

---

## 📋 Features

- Login with email and password
- User listing with pagination
- Create new users
- Edit existing users
- Delete users (cannot delete your own account)
- Status management — Active / Inactive
- Form validation with real-time feedback
- Success and error toast notifications
- Global loader for in-flight requests
- Dark mode support

---

## 🧪 Testing

End-to-end tests are written with **Playwright**.

```bash
# Run all tests
npx playwright test

# Run with visual UI
npx playwright test --ui

# Run a specific file
npx playwright test tests/users.spec.ts
```

---

## 🛠 Available Scripts

```bash
npm run dev         # Start the development server
npm run build       # Generate the production build
npm start           # Start the production server
npm run lint        # Run ESLint
npx playwright test # Run E2E tests
```

## License

Proprietary - All right reserved to William Barbosa

---

**Version:** 1.0.0
**last Update:** Feb 2026
**Developed by:** William Barbosa
