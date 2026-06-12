Great idea. An AGENT.md gives your vibe coding agent full context so every component, page, and decision it makes is aligned with CatchAm's identity. Here it is:

---

# AGENT.md — CatchAm AI

## What You Are Building

You are building CatchAm AI, a 24/7 automated deepfake detection and digital security web platform. The product protects corporate brands, public figures, and everyday Nigerians from synthetic media fraud including AI voice clones and deepfake videos. It operates as a standalone web application with two core functions: a proactive news and blog crawling system for enterprise clients, and a free public file upload and link scanner for general users.

This is a real product being submitted to the OPay National Innovation Challenge 2026. Every decision you make should reflect production-grade thinking, not a demo or prototype aesthetic.

---

## Design System

Base your entire UI on the Revolut design language with Supabase dark emerald colour influence.

Dark interface throughout. No light mode. Background is near-black or very dark grey. Primary accent is emerald green. Cards use subtle gradient borders. Typography is tight, clean, and confident. No playful illustrations, no warm tones, no rounded bubbly elements. This is a security product. It should feel like it protects things.

Specific tokens to maintain consistently:

Background: #0A0A0A or #0F1117
Primary accent: #00C170 (emerald green)
Secondary accent: #1A7A4A
Card surface: #141414 or #1A1A1A
Border: subtle green tint, low opacity
Text primary: #FFFFFF
Text secondary: #A0A0A0
Font: Inter or Geist, clean and sans-serif throughout
Button style: solid emerald fill for primary actions, ghost with green border for secondary
No shadows, use borders and subtle glows instead

---

## Tech Stack

Frontend: Next.js App Router
Backend: Python FastAPI microservice in the /backend folder
Database and storage: Supabase, PostgreSQL, Supabase Storage buckets
AI models: XceptionNet for video deepfake detection, AASIST for audio deepfake detection, RetinaFace for face localisation and bounding box mapping
Deployment target: Vercel for frontend, Railway or Render for Python backend

Keep the frontend and backend completely separate. The Next.js app communicates with the Python FastAPI backend via REST API calls. Supabase is the shared data layer between both.

---

## Core Features to Build

Feature 1, Public Scanner: A clean upload zone where any user can drag and drop or select a video or audio file, or paste a public URL. No login required. The file is sent to the Python backend for analysis. The result is displayed as a clear pass or fail with a confidence score and a downloadable forensic report containing red bounding boxes around anomalous regions if fraud is detected.

Feature 2, Enterprise Dashboard: A protected dashboard for registered enterprise clients. Shows monitored web crawl activity, flagged media alerts, forensic report history, and account settings. Requires authentication via Supabase Auth.

Feature 3, Forensic Report View: A dedicated report page showing the analysed media, the red indicator bounding boxes rendered over the anomalous frames, a confidence score, the specific anomaly type detected such as lip-sync tearing or audio frequency spike, and a download button for the full report PDF.

Feature 4, Alert System: Real-time notifications delivered to enterprise clients when a flagged media item is detected during web crawling. Use Supabase real-time subscriptions for this.

---

## File Structure

Follow this structure strictly:

catcham-ai/
├── frontend/
│   ├── app/
│   │   ├── page.tsx (landing page)
│   │   ├── scan/page.tsx (public scanner)
│   │   ├── dashboard/page.tsx (enterprise dashboard)
│   │   ├── report/[id]/page.tsx (forensic report view)
│   │   └── auth/page.tsx (login and signup)
│   ├── components/
│   ├── lib/
│   │   └── supabase.ts
│   └── AGENT.md
└── backend/
    ├── main.py (FastAPI entry point)
    ├── models/ (XceptionNet, AASIST, RetinaFace loaders)
    ├── routes/ (API endpoints)
    └── utils/ (preprocessing, bounding box rendering)

---

## Product Identity

Product name: CatchAm AI
Tagline: Your shield against synthetic identity fraud
Theme: Cybersecurity and AI for Social Good
Target users: Nigerian enterprises, public figures, banks, and everyday Nigerians
Competition context: OPay National Innovation Challenge 2026, theme Cybersecurity and AI for Social Good

---

## The Problem This Product Solves

Traditional cybersecurity frameworks block unauthorised account access but cannot detect social engineering via AI clones. When a fraudster synthesises the voice of a CEO or family member and sends an urgent voice note demanding a transfer, the victim opens their own banking app, passes their own liveness check, and sends the money willingly. The financial system sees a legitimate transaction. CatchAm intercepts the manipulation before the victim ever opens their banking app.

OPay's liveness check prevents an unauthorised criminal from breaking into a wallet. CatchAm prevents an authorised user from being manipulated into opening it themselves. The two systems are complementary, not competing.

---

## The Team

Samuel Tehillah Husseini, Team Lead, 300-level Microbiology student, Nasarawa State University Keffi
Inalegwu Joseph Jonah, Software Developer and Product Architect, 300-level Computer Science student, Nasarawa State University Keffi
Abah Helen Ene, Lead Business Strategist, 300-level Business Administration student, Nasarawa State University Keffi
Sunday Alpha Bonet, Design and Visual Systems, 300-level Business Administration student, Nasarawa State University Keffi
Samuel Evelyn Nevan, Lead Researcher, 300-level Computer Science student, Nasarawa State University Keffi

---

## Team Story Context

None of us planned this. Five third-year students from three different departments at Nasarawa State University Keffi found each other in the first week of June 2026 through a chain of messages and a shared frustration most Nigerians do not yet have language for. Before we ever spoke to each other, we had each independently been troubled by the same thing: the ease with which AI could clone a voice, fabricate a face, and weaponise trust. When we came together to shape an idea, we discovered we had all been carrying the same quiet anger. CatchAm AI was not invented in that first meeting. It was recognised.

---

## Coding Rules

Always use TypeScript in the frontend. Never use JavaScript files in the Next.js app.
All API calls from frontend to backend go through a dedicated lib/api.ts file. Never call the Python backend directly from a component.
All Supabase calls go through lib/supabase.ts. Never initialise Supabase inside a component.
Use server components by default. Only use client components when interactivity requires it. Mark them with use client explicitly.
Never hardcode API URLs. Use environment variables exclusively.
All environment variables go in .env.local and must also be documented in .env.example with placeholder values.
Error states and loading states are required on every page that makes an API call. Never leave a page without handling both.
The forensic report bounding boxes are rendered by the Python backend, not the frontend. The frontend only displays the output image returned by the API.
Keep components small and single-purpose. If a component exceeds 150 lines, split it.

---

## Tone and Copy Guidelines

Every label, heading, button, and message on the platform should feel confident and protective, never alarming or dramatic. You are a security tool, not a panic button.

Good examples: Scan this file. Verification complete. No synthetic content detected. Alert sent to your security team.

Bad examples: WARNING: DEEPFAKE DETECTED. DANGER. Your file may be compromised.

The product speaks calmly and with authority. It has already seen worse.

---