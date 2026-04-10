# Finance App Frontend

A modern React + TypeScript + Tailwind CSS frontend for the Finance API.

## Project Setup

All dependencies are already installed. To start development:

```bash
npm run dev
```

The app will run on **http://localhost:3000** with a Vite dev proxy forwarding `/api` requests to `http://localhost:8080` (the backend).

## Architecture

### Directory Structure

```
src/
├── components/ui/           # Reusable UI components (Button, Input, Modal, etc.)
├── features/                # Feature modules (auth, accounts, categories, transactions)
├── hooks/                   # Custom React hooks
├── layout/                  # App layout components (Sidebar, Topbar)
├── lib/                     # Utilities (cn() helper, axios client)
├── router/                  # React Router setup
├── store/                   # Zustand auth store
├── types/                   # API type definitions
├── index.css                # Tailwind CSS + global styles
└── main.tsx                 # React app entry point
```

### Key Technologies

- **React 19** + **TypeScript** (strict mode)
- **Vite** for fast HMR bundling
- **Tailwind CSS v4** with dark mode support
- **React Router v7** for client routing
- **TanStack Query v5** for server state management
- **Zustand v5** for auth global state (with localStorage persistence)
- **React Hook Form v7** + **Zod** for form validation
- **Axios v1** with request/response interceptors for API calls
- **@headlessui/react** for accessible components
- **react-hot-toast** for notifications

## Authentication Flow

1. User enters credentials on `/login`
2. Frontend calls `POST /api/v1/auth/login` → receives `accessToken` + `refreshToken`
3. Tokens stored in Zustand (persisted to localStorage)
4. Axios request interceptor attaches `Authorization: Bearer <token>` to all requests
5. On 401: response interceptor silently refreshes token via `POST /api/v1/auth/refresh` with `X-Refresh-Token` header
6. User data fetched from `GET /api/v1/users/me` and stored in Zustand
7. Protected routes redirect to `/login` if not authenticated

## Current Status

### ✅ Completed

- Project scaffold (Vite + TS + Tailwind)
- All configuration files (vite.config.ts, tsconfig.json, tailwind.config.ts)
- Core infrastructure:
  - Zustand auth store with persistence
  - Axios client with token refresh interceptors
  - React Router with protected routes
  - App layout (Sidebar, Topbar)
- All reusable UI components (9 components)
- Auth feature (login page with form validation)

### ⏳ Next Steps (To Implement)

The following features are stubbed out but need full implementation:

1. **Accounts Feature** (`src/features/accounts/`)
   - [ ] `accountTypes.ts` — AccountResponse, AccountRequest types
   - [ ] `accountSchemas.ts` — Zod validation (max 20 chars)
   - [ ] `accountService.ts` — API calls (base `/api/v1/accounts`)
   - [ ] `accountQueries.ts` — React Query hooks
   - [ ] `AccountForm.tsx` — Create/edit modal
   - [ ] `AccountList.tsx` — Full CRUD page with grid layout

2. **Categories Feature** (`src/features/categories/`)
   - [ ] Same as Accounts but:
   - [ ] Base path `/api/categories` (no v1!)
   - [ ] Max 30 chars in schema
   - [ ] Disable edit/delete buttons when `isDefault === true`
   - [ ] Display "Padrão" badge for default categories

3. **Transactions Feature** (`src/features/transactions/`)
   - [ ] Full CRUD with account + category dropdown selects
   - [ ] Type selector (INCOME/EXPENSE buttons)
   - [ ] Date input (uses native `<input type="date">`)
   - [ ] Client-side filtering (type, account, category)
   - [ ] Currency formatting with `Intl.NumberFormat`
   - [ ] Table layout on desktop, cards on mobile
   - [ ] Amount stays as string (never parse to float)

4. **Polish**
   - [ ] Dark mode toggle in Topbar (already wired)
   - [ ] Error handling (422 field-error propagation)
   - [ ] Loading states and spinners
   - [ ] Responsive mobile layout with hamburger nav
   - [ ] Toast notifications on success/error

## Development Guide

### Running the App

```bash
# Development server with HMR
npm run dev

# Backend must be running on localhost:8080
# Frontend dev proxy automatically forwards /api requests
```

### Type Checking

```bash
# Run TypeScript compiler without emitting
npm run type-check
```

### Building for Production

```bash
# Requires Node.js 20.19+ or 22.12+
npm run build
npm run preview
```

## Code Style

All code follows the conventions in `.claude/rules/`:
- ✅ TypeScript `strict: true` everywhere
- ✅ No `any`, use `unknown` + narrowing
- ✅ No `React.FC`, use typed function components
- ✅ `type` for props/unions, `interface` for API models
- ✅ Tailwind utility-first, no arbitrary values
- ✅ Mobile-first responsive design
- ✅ Dark mode support on all components
- ✅ `cn()` utility for all class merging (clsx + tailwind-merge)
- ✅ `forwardRef` with `displayName` on all input components

## API Endpoints Reference

**Auth:**
- `POST /api/v1/auth/login` → `{ accessToken, refreshToken, tokenType, expiresIn }`
- `POST /api/v1/auth/refresh` (header: `X-Refresh-Token`) → same response

**Users:**
- `GET /api/v1/users/me` → `{ id, fullName, email, roles, isActive }`

**Accounts:**
- `GET /api/v1/accounts` → `AccountResponse[]`
- `GET /api/v1/accounts/:id`
- `POST /api/v1/accounts` (body: `{ name }`)
- `PUT /api/v1/accounts/:id` (body: `{ name }`)
- `DELETE /api/v1/accounts/:id` → 204

**Categories:**
- `GET /api/categories` → `CategoryResponse[]` (no v1!)
- `GET /api/categories/:id`
- `POST /api/categories` (body: `{ name }`)
- `PUT /api/categories/:id` (body: `{ name }`)
- `DELETE /api/categories/:id` → 204

**Transactions:**
- `GET /api/transactions` → `TransactionResponse[]`
- `GET /api/transactions/:id`
- `POST /api/transactions` (body: `{ categoryId, accountId, type, amount, date, description }`)
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id` → 204

All protected endpoints require: `Authorization: Bearer <access_token>`

## Troubleshooting

**Backend CORS issues:**
- Ensure backend allows `http://localhost:3000` in CORS config
- Vite proxy forwards `/api` to `:8080` so browser always talks to `:3000`

**Token refresh fails:**
- Check refresh token is stored in Zustand state
- Verify `/api/v1/auth/refresh` endpoint accepts `X-Refresh-Token` header
- On refresh failure, user is logged out and redirected to `/login`

**Tailwind styles not showing:**
- Ensure `npm run dev` is running (not `npm run build`)
- Clear browser cache or do hard refresh (Ctrl+Shift+R)
- Check `tailwind.config.ts` content paths are correct

## Notes

- **Amount handling**: The API sends transaction amounts as strings (Java `BigDecimal`). Never convert to `number`—keep as string throughout to avoid floating-point precision loss. Display via `Intl.NumberFormat`.
- **Dates**: Transaction dates are ISO strings (`"2026-04-04"`). Use `<input type="date">` which returns this format natively.
- **API inconsistency**: Accounts uses `/api/v1/accounts`, but Categories and Transactions use `/api/categories` and `/api/transactions` (no `v1`). Check services carefully!
- **Default categories**: Cannot be edited/deleted in the UI. Guard with `category.isDefault === true` checks.
- **Description is required**: The backend has `@NotBlank` on transaction description—it's not optional.

---

**Happy coding!** Follow the plan file at `/home/paulo/.claude/plans/jolly-herding-fiddle.md` for implementation order.
