# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CinemaGhar Admin - A Next.js 16 admin panel for managing cinema operations (movies, theaters, bookings, users, reports).

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand (state), Axios (API)

**Folder Structure:**
- `app/(auth)/` - Auth pages (login, register, password reset)
- `app/(root)/` - Protected admin pages (Dashboard, Movies, Theatres, Bookings, Users, Reports, Settings)
- `app/page.tsx` - Root redirect based on auth state
- `components/` - UI components (Button, InputField, Table, Toaster, AuthGuard, Navbar)
- `stores/` - Zustand stores (auth, ui, movie, booking, admin, report) with persistence
- `services/` - API service layer (auth, user, movie, booking, payment, admin, report)
- `types/` - TypeScript type definitions
- `lib/` - Utilities (axios instance with interceptors, date/currency formatters)

**Key Patterns:**
- API base URL: `NEXT_PUBLIC_API_URL` or `http://localhost:5500/api/v1`
- Auth token stored in `localStorage` as `cinema_token`
- Zustand stores use `persist` middleware for state hydration
- `AuthGuard` component protects admin routes (checks `user.role === 'admin'`)
- All API requests go through axios instance with 401 interceptor (auto-redirect to `/login`)
