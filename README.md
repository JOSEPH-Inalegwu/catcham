# CatchAm AI

Your shield against synthetic identity fraud.

## What this is

CatchAm AI is a deepfake detection platform built for the OPay National Innovation Challenge 2026. It protects corporate brands, public figures, and everyday Nigerians from AI voice clones and deepfake videos used to manipulate people into sending money or destroying reputations.

You upload a video, audio file, or paste a public link. CatchAm tells you if it is real or synthetic before you act.

## The problem

Traditional cybersecurity blocks unauthorised access. When a fraudster clones your CEO's voice and sends an urgent voice note demanding a transfer, you open your own banking app, pass your own liveness check, and send the money willingly. The financial system sees a legitimate transaction. Nobody flags it.

The average Nigerian cannot tell a deepfake from reality. The technology has outpaced human instinct.

## The Solution: Dual-Layer Defence Protocol

CatchAm AI operates as a context-aware verification layer protecting corporate brands, banking ecosystems, and public figures through two distinct operational frameworks:

### 1. Reactive Layer (Public Scanner)

Built for everyday Nigerian consumers to protect their finances before completing a transfer.
* Instant Verification: Any user can upload a file or paste a public link natively to check for synthetic tampering.
* Advisory Verdicts: The system instantly returns a clear, real-world authenticity rating.
* Visual Forensic Proof Engine: Users can unlock a complete, court-ready forensic report. To protect system integrity, highly detailed red indicator bounding boxes only render when confidence metrics pass a strict mathematical threshold, while borderline anomalies default to high-accuracy text summaries to eliminate false-positive risks.

### 2. Proactive Layer (Enterprise Monitoring)

Engineered for brands, corporate executives, and public figures to protect their digital identities and reputations.
* Continuous Crawling: 24/7 autonomous monitoring of Nigerian digital platforms, regional blogs, and open web directories for unverified media matching a registered client profile.
* Intelligent Cost Isolation: Uses a Two-Tier Gateway structure. Low-cost passive matching filters process raw streams continuously, activating heavy GPU-intensive deep learning networks (XceptionNet/AASIST) only when a profile match is verified—keeping operational overhead highly optimized.
* Instant Escalation: Generates and delivers rapid emergency alerts directly to corporate security and PR divisions for immediate damage control.

## Tech stack

* Frontend. Next.js 14/15 (App Router), React, TypeScript, Tailwind CSS, Geist font.
* Backend. Python FastAPI with XceptionNet for video detection, AASIST for audio detection, MTCNN for face localisation.
* Database. Supabase (PostgreSQL, Storage, Auth).
* Deployment. Vercel (frontend), Railway or Render (backend).

## Getting started

### Frontend configuration

Install frontend dependencies and start the development server from the root directory:
```bash
npm install
npm run dev

```

Open http://localhost:3000 to view the landing page.

### Environment variables

Copy .env.example to .env.local and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

```

### Backend architecture

The FastAPI backend lives in the /backend directory. Navigate to the folder, initialize your virtual environment, install dependencies, and execute the initialization script:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows Git Bash
pip install -r requirements.txt
python main.py

```

## Project structure

```
frontend/
├── app/
│   ├── page.tsx           Landing page
│   ├── scan/page.tsx       Public scanner
│   ├── report/[id]/page.tsx   Forensic report view
│   ├── dashboard/page.tsx Enterprise dashboard
│   └── actions/scan.ts     Server action for file scanning
├── components/             Reusable UI components
├── lib/
│   ├── api.ts             Backend API client
│   └── supabase.ts         Supabase client
└── public/                 Static assets

```

## The team

Five students at Nasarawa State University Keffi:

* Samuel Tehillah Husseini — Team Lead
* Inalegwu Joseph Jonah — Software Developer and Product Architect
* Abah Helen Ene — Lead Business Strategist
* Sunday Alpha Bonet — Design and Visual Systems
* Samuel Evelyn Nevan — Lead Researcher

Built for the OPay National Innovation Challenge 2026, theme Cybersecurity and AI for Social Good.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.