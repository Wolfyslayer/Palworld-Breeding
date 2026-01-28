# PalWorld Companion

## Overview

A full-stack web application for PalWorld players that provides breeding calculations and build optimization tools. The app helps users determine optimal parent combinations for breeding specific Pals, calculates passive skill inheritance probabilities, and offers curated build recommendations for combat, base management, and mounts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and reveals
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a page-based structure with reusable components. Pages are located in `client/src/pages/`, shared components in `client/src/components/`, and custom hooks in `client/src/hooks/`. Path aliases (`@/`, `@shared/`) are configured for clean imports.

### Backend Architecture

- **Framework**: Express.js 5 with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Design**: RESTful endpoints defined in `server/routes.ts`
- **Route Contracts**: Shared type definitions in `shared/routes.ts` using Zod schemas for validation

The server handles API requests at `/api/*` routes and serves the static frontend in production. Development uses Vite's middleware for hot module replacement.

### Data Storage

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Location**: `shared/schema.ts` contains table definitions for `pals`, `passives`, and `specialCombos`
- **Migrations**: Drizzle Kit manages schema migrations in the `migrations/` directory

Database tables:
- `pals`: Stores creature data (name, image, breeding power, types, rarity)
- `passives`: Stores passive skill data (name, tier, description, effects)
- `specialCombos`: Stores special breeding combinations that override normal calculations

### Build System

- **Development**: `npm run dev` runs tsx with Vite middleware
- **Production Build**: Custom build script in `script/build.ts` that:
  1. Uses Vite to build the frontend to `dist/public`
  2. Uses esbuild to bundle the server to `dist/index.cjs`
  3. Bundles select dependencies to reduce cold start times

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-styled component collection using Radix + Tailwind
- **Lucide React**: Icon library

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment integration

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tools
- `zod` / `drizzle-zod`: Schema validation and type inference
- `@tanstack/react-query`: Async state management
- `framer-motion`: Animation library
- `wouter`: Lightweight React router