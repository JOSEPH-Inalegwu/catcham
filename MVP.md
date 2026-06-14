# CatchAm AI — MVP Prototype Documentation

GitHub Repository: https://github.com/JOSEPH-Inalegwu/catcham

## Note on Model File

The trained detection model (XceptionNet, ~122MB) exceeds GitHub's file size limit and is not included in the repository. It can be downloaded separately from Kaggle: https://kaggle.com/models/armanchaudhary/xception5o

Place the downloaded `xception_5o.h5` file inside `backend/model/`.

## How to Run Locally

Clone the repository:

```bash
git clone https://github.com/JOSEPH-Inalegwu/catcham
```

**Backend setup:**

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python main.py
```

The FastAPI server starts on `http://localhost:8000`. You should see `Received file: ...` logs in the terminal when a scan request comes in.

**Frontend setup:**

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to view the landing page.

**Environment variables:**

Copy `frontend/.env.example` to `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
GEMINI_API_KEY=your-gemini-api-key
```

`GEMINI_API_KEY` is optional. Without it, the report page falls back to built-in forensic summary text.

## Architecture Overview

```
Next.js frontend (landing page + public scanner)
        │
        ▼
FastAPI backend (Python, port 8000)
        │
        ▼
MTCNN (face detection) + XceptionNet (deepfake classification)
        │
        ▼
Returns: REAL or FAKE with confidence score and face bounding box coordinates
```

**Request flow:**

1. User uploads a file (image or video) on the scan page
2. Frontend sends the file to the FastAPI `/predict` endpoint via a Next.js server action
3. Backend runs MTCNN to detect faces, then XceptionNet classifies each face as real or fake
4. Backend returns the verdict, confidence score, prediction ID, and bounding box coordinates
5. Frontend stores the scan payload in localStorage, displays an authenticity-first result card
6. User navigates to the forensic report page, which hydrates from localStorage and fetches a Gemini-generated plain-English advisory

## What the MVP Does

**Landing page:** Full marketing page with problem statement, how-it-works flow, features, FAQ, and CTA. Dark interface, emerald green accent, Geist font.

**Public scanner:** Drag-and-drop or click-to-upload. Accepts images and video up to 20MB. Progress bar fills from 0-99% during scanning, hits 100% when the backend returns. Shows an authenticity-first result card with a "View full report" link.

**Forensic report (free tier):** Clean, centred layout showing the authenticity percentage and a Gemini-generated advisory paragraph explaining what the score means in plain language for everyday users.

**Forensic report (enterprise tier):** Full forensic view with authenticity rating, 3-card grid (verdict, anomaly type, media type), and the advisory in an analysis summary section. Tier switching is wired up and ready for enterprise auth.

**Backend inference:** XceptionNet + MTCNN pipeline. Handles images and video. Returns verdict, confidence, and face bounding box coordinates. Terminal logs show each incoming file and its result.

## What Is Scoped for Next

- **Audio deepfake detection** — AASIST model integration on the backend
- **Bounding box overlay** — Red indicator rendering on the frontend using the coordinates returned by the backend
- **URL paste scanning** — Backend endpoint for fetching and analysing media from public links
- **Enterprise dashboard** — Protected dashboard with monitored web crawl activity, alert management, and forensic report history
- **Supabase integration** — Authentication, database, and real-time alerts for enterprise clients
- **Visual forensic proof engine** — Court-ready bounding box rendering with confidence-threshold-based display logic

## Demo

A short demo video showing the working prototype is included in this submission folder.

## The Team

Five students at Nasarawa State University Keffi:

* Samuel Tehillah Husseini — Team Lead
* Inalegwu Joseph Jonah — Software Developer and Product Architect
* Abah Helen Ene — Lead Business Strategist
* Sunday Alpha Bonet — Design and Visual Systems
* Samuel Evelyn Nevan — Lead Researcher

Built for the OPay National Innovation Challenge 2026, theme Cybersecurity and AI for Social Good.
