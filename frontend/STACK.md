# STACK.md — CatchAm AI

## Frontend

Runtime: Node.js 22.17.1
Framework: Next.js 16.2.9
Language: TypeScript 5
UI Library: React 19.2.4
Styling: Tailwind CSS 4
Linting: ESLint 9 with eslint-config-next 16.2.9

## Frontend Packages

@supabase/supabase-js 2.108.1

## Backend

Framework: FastAPI
Language: Python 3
Status: Not yet installed. Set up when frontend is complete.

## Backend Packages

To be defined. Will include FastAPI, Uvicorn, OpenCV, PyTorch, and model-specific dependencies for XceptionNet, AASIST, and RetinaFace.

## Database and Storage

Platform: Supabase
Database: PostgreSQL via Supabase
Storage: Supabase Storage buckets
Auth: Supabase Auth
Client: @supabase/supabase-js 2.108.1

## Environment Variables

All environment variables live in .env.local and are documented with placeholder values in .env.example. Never commit either file.

Required frontend variables:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_BACKEND_URL

## Notes

Tailwind CSS 4 uses the PostCSS plugin via @tailwindcss/postcss. Configuration differs from Tailwind 3. Do not follow Tailwind 3 documentation.

Next.js 16 uses the App Router exclusively. No pages directory. No getServerSideProps or getStaticProps.