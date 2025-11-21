# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a darts scoring application with a full-stack web application (backend) and a native iOS app (app). The web backend is a Turborepo monorepo using pnpm workspaces with:
- **Backend**: NestJS server with Fastify (apps/server)
- **Frontend**: React with Vite (apps/client)
- **iOS App**: SwiftUI native application
- **Shared packages**: UI components, types, Prisma schema, utilities, ESLint/TS configs

## Development Commands

All commands should be run from the `backend/` directory unless specified otherwise.

### Initial Setup
```bash
# Copy environment template
cp .env.template .env

# Install dependencies (also runs prisma generate)
pnpm install

# Start local Postgres database
./startPostgres.sh
# This creates a Docker container named "dart-app-postgres" on port 6543
# Connection: postgresql://dart-app:mysecretpassword@localhost:6543/dart-app_db

# Run database migrations
pnpm db:migrate
```

**Important**: Add `DATABASE_URL` to your `.env` file:
```
DATABASE_URL="postgresql://dart-app:mysecretpassword@localhost:6543/dart-app_db"
```

### Development
```bash
# Start both client and server in dev mode
pnpm dev

# Start only the client (React/Vite)
pnpm dev:client

# Start only the server (NestJS)
pnpm dev:server
```

### Building
```bash
# Build all packages and apps
pnpm build

# Type checking across workspace
pnpm tsc
```

### Linting & Formatting
```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Biome
pnpm format

# Check formatting
pnpm format:verify
```

### Database
```bash
# Generate Prisma client (automatically runs on postinstall)
pnpm generate:prisma

# Run database migrations
pnpm db:migrate
```

## Architecture

### Backend Monorepo Structure

**Apps** (`apps/`):
- `server/`: NestJS API server with Fastify
  - Entry point: `src/main.ts`
  - Global prefix: `/api`
  - Modules: Auth, User, Signup, Mail, Password, Files, Game, Player
  - Uses path alias `@/` for `src/`
- `client/`: React SPA with Vite
  - Entry point: `src/main.tsx`
  - Routing: `Routes.tsx`
  - State: Zustand (`store/`)
  - API calls: React Query (`repository/`)

**Shared Packages** (`packages/`):
- `ui/`: Reusable React components built with Radix UI and Tailwind
  - Exports components, hooks, forms, i18n utilities
  - Shared by `client` app
- `prisma/`: Database schema and Prisma client
  - Schema: `prisma/schema.prisma`
  - Generated client output: `dist/`
- `types/`: Shared TypeScript types
- `utils/`: Shared utility functions
- `eslint-config/`: Shared ESLint configuration
- `ts-config/`: Shared TypeScript configurations

### Database

- **ORM**: Prisma with PostgreSQL
- **Schema location**: `backend/packages/prisma/prisma/schema.prisma`
- **Key models**: User, Game, GameTurn, Player, RefreshToken, AccessToken, File
- After schema changes, run `pnpm generate:prisma` and `pnpm db:migrate`

### Authentication

- JWT-based authentication with refresh tokens
- Access tokens expire in 960s (16 min), refresh tokens in 30 days
- Google OAuth support
- Email verification flow with tokens
- Password reset with unique tokens

### Features

- Complete user auth flow (register, email verification, login, Google OAuth, password reset)
- User profile management with profile picture upload and cropping
- File storage (S3-compatible or local filesystem)
- Email system with nodemailer
- Internationalization (i18n) support
- Optional integrations: Sentry (error monitoring), Plausible (analytics), OTel logging
- Privacy policy endpoint serving localized markdown files
- Darts game tracking with ELO ratings and statistics

### iOS App

- **Location**: `app/DartsScoringApp/`
- **Platform**: Native SwiftUI application
- **Entry point**: `DartsScoringAppApp.swift`
- **Structure**:
  - `Models/`: Data models
  - `Game/`: Game-related views
  - `GameSetup/`: Game setup screens
  - `AppServices/`: Services layer
  - `Assets.xcassets/`: Asset catalog

### Key Technologies

- **Backend**: NestJS, Fastify, Prisma, PostgreSQL, Winston (logging), JWT, AWS SDK (S3)
- **Frontend**: React 18, Vite, TanStack Query, TanStack Form, Zustand, Tailwind CSS, i18next
- **Monorepo**: Turborepo, pnpm workspaces, pnpm catalog for shared deps
- **Formatting**: Biome
- **Testing**: Jest (configured but implementation needed)

### Deployment

- Docker and docker-compose files provided
- Privacy policy files must be added to `apps/server/dist/src/assets/privacy-policy/files/` (e.g., `en.md`, `de.md`)
- Can mount privacy policy volume in docker-compose instead of committing files
- Frontend is served by the backend server via middleware in production

### Environment Variables

See `.env.template` for all required environment variables including:
- Database connection (add manually: `DATABASE_URL`)
- JWT configuration
- SMTP settings for email
- S3 or local file storage config
- Optional: Sentry DSNs, Plausible URL, OTel logging URL
- Imprint/copyright information
