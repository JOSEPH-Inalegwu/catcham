"use client";

import { RevealWrapper } from 'next-reveal';
import { useMode } from "@/lib/mode-context";

const icons = {
  scan: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  ai: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
      <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z" />
      <circle cx="12" cy="10" r="2" fill="#00d992" fillOpacity="0.3" />
      <path d="M20 8l2 2-2 2M4 8l-2 2 2 2" strokeWidth="1.5" />
    </svg>
  ),
  gauge: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
      <path d="M12 6v2" />
    </svg>
  ),
  audio: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M9 14l12-2" />
    </svg>
  ),
  report: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <rect x="9" y="10" width="6" height="4" rx="1" fill="#00d992" fillOpacity="0.2" />
    </svg>
  ),
  unlock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  ),
  code: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
};

const freeFeatures = [
  {
    title: "Multi-format scanning",
    desc: "Upload video, image, or audio files. Our engine checks every frame and waveform for synthetic manipulation.",
    icon: icons.scan,
  },
  {
    title: "AI model attribution",
    desc: "Know exactly which generative model created the content. Midjourney, OpenAI DALL-E, Stable Diffusion, Google Gemini, and 100+ more.",
    icon: icons.ai,
  },
  {
    title: "Confidence scoring",
    desc: "Every scan returns a clear percentage so you know how certain the verdict is, no ambiguity, no guesswork.",
    icon: icons.gauge,
  },
  {
    title: "Audio integrity check",
    desc: "Video files get an independent audio authenticity pass. Cloned voices don't slip through the visual-only gap.",
    icon: icons.audio,
  },
  {
    title: "Forensic report",
    desc: "Generate an immutable, downloadable forensic report containing deep anomaly details, signature histories, and legal audit trails.",
    icon: icons.report,
    pro: true,
  },
  {
    title: "No account required",
    desc: "Upload and scan immediately. No sign-up, no onboarding. Just the answer you need when you need it.",
    icon: icons.unlock,
  },
];

const proFeatures = [
  {
    title: "24/7 Proactive Crawling",
    desc: "Our systems continuously scan Nigerian news portals, blogs, and public directories for unauthorized synthetic media matching your profile.",
    icon: icons.scan,
  },
  {
    title: "API Integration",
    desc: "Integrate CatchAm's multimodal detection pipeline directly into your platform. Programmatically process thousands of files simultaneously.",
    icon: icons.code,
  },
  {
    title: "Encrypted Digital Profiles",
    desc: "Baseline media is hashed and secured via strict irreversible cryptography, aligning perfectly with Nigerian Data Protection Regulations.",
    icon: icons.shield,
  },
  {
    title: "Instant Threat Escalation",
    desc: "Receive real-time webhook callbacks and SMS alerts the moment a high-confidence synthetic clone of your likeness is discovered.",
    icon: icons.audio,
  },
  {
    title: "Visual Forensic Reports",
    desc: "Get explainable AI output. We generate downloadable PDFs with precise red bounding boxes drawn directly around the manipulated anomalies.",
    icon: icons.report,
  },
  {
    title: "Pay-as-you-go Buckets",
    desc: "Don't want a subscription? Purchase buckets of 10 detailed forensic reports for just 8,000 NGN, usable anytime via our portal.",
    icon: icons.unlock,
  },
];

export default function Features() {
  const { mode } = useMode();
  const features = mode === "free" ? freeFeatures : proFeatures;

  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <RevealWrapper origin="bottom" delay={100} duration={800} distance="40px">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
              {mode === "free" ? "Everything You Need" : "Enterprise Capabilities"}
            </p>
            <h2 className="mt-2 text-2xl font-normal text-[#ffffff] sm:text-3xl">
              {mode === "free" ? "One scanner, full protection" : "A complete security architecture"}
            </h2>
          </div>
        </RevealWrapper>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <RevealWrapper 
              key={i} 
              origin="bottom" 
              delay={150 + (i * 50)} 
              duration={800} 
              distance="30px"
              className="h-full"
            >
              <div
                className="h-full rounded-[8px] border border-[#3d3a39] p-6"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#00d992]/30 bg-[#00d992]/10">
                  {(f as any).icon}
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#ffffff]">
                    {f.title}
                  </h3>
                  {(f as any).pro && (
                    <span className="rounded-[4px] border border-[#00d992]/30 bg-[#00d992]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#00d992]">
                      Pro
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[#a0a0a0]">
                  {f.desc}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
