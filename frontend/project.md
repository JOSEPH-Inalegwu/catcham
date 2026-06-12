# PROJECT.md — CatchAm AI

## What This Is

CatchAm AI is a 24/7 automated deepfake detection and digital security platform built for the OPay National Innovation Challenge 2026 under the theme Cybersecurity and AI for Social Good.

It protects corporate brands, public figures, and everyday Nigerians from synthetic media fraud, specifically AI voice clones and deepfake videos used to manipulate people into sending money or destroying reputations.

## The Problem

Traditional cybersecurity frameworks block unauthorised account access but cannot detect social engineering via AI clones. When a fraudster synthesises the voice of a CEO or family member and sends an urgent voice note demanding a transfer, the victim opens their own banking app, passes their own liveness check, and sends the money willingly. The financial system sees a legitimate transaction. Nobody flags it. By the time the real person finds out, the money is gone.

OPay's liveness check prevents an unauthorised criminal from breaking into a wallet. CatchAm prevents an authorised user from being manipulated into opening it themselves. The two systems are complementary, not competing.

The average Nigerian cannot tell a deepfake from reality. Not because they are careless, but because the technology has outpaced human instinct entirely. This is not a future threat. It is happening now in Nigerian WhatsApp groups, on Nigerian timelines, and in Nigerian homes.

## The Solution

CatchAm AI operates through two complementary layers.

Layer 1, Proactive: For registered enterprise clients, the system continuously crawls Nigerian public digital spaces including news portals, regional blogs, and public web directories, scanning for unverified media matching a registered client profile. This protects reputation.

Layer 2, Reactive: Any user who receives a suspicious file or sees a viral clip uploads it or pastes the public link into the CatchAm web portal. The system processes it instantly and returns a forensic result before the user opens any banking application. This protects finances.

When fraud is detected, the platform generates a downloadable forensic report with a red indicator bounding box drawn precisely around the anomalous region, whether unnatural lip-sync tearing, facial warping, or audio frequency spikes. Any non-technical person can identify the fraud at a glance.

## Why It Matters

Five university students from Nasarawa State University Keffi built this because they grew up in the same culture of trust that scammers now exploit. They understand what it means when someone you love calls and says they need help right now. They understand the panic, the urgency, the instinct to act before you think. CatchAm AI exists to be the moment of pause before that happens.

## The Team

Samuel Tehillah Husseini, Team Lead, 300-level Microbiology
Inalegwu Joseph Jonah, Software Developer and Product Architect, 300-level Computer Science
Abah Helen Ene, Lead Business Strategist, 300-level Business Administration
Sunday Alpha Bonet, Design and Visual Systems, 300-level Business Administration
Samuel Evelyn Nevan, Lead Researcher, 300-level Computer Science

All five are students at Nasarawa State University Keffi.

## What We Are Building

A Next.js 16 web application with a Python FastAPI backend and Supabase as the database, storage, and auth layer.

The frontend has four core pages. The landing page explains the product and directs users to the scanner. The public scanner page allows anyone to upload a file or paste a link with no login required. The forensic report page displays the analysis result with the red bounding box output. The enterprise dashboard is a protected area for registered clients to monitor crawl alerts and report history.

The Python backend handles all AI detection logic using XceptionNet for video, AASIST for audio, and RetinaFace for face localisation and bounding box rendering. The frontend never interprets or modifies detection results. It only displays what the backend returns.

## Competition Context

Challenge: OPay National Innovation Challenge 2026
Partner: Google
Theme: Cybersecurity and AI for Social Good
Deadline: June 14, 2026
Prize: 10 million naira for first place
Portal: opayweb.com/innovation-challenge

## Success Criteria

A working public scanner that accepts a file or link and returns a clear real or synthetic result.

A forensic report page that displays the red bounding box output cleanly.

A dark, professional interface that communicates trust and security at first glance.

Code that is clean, readable, and explainable to a judge or evaluator.