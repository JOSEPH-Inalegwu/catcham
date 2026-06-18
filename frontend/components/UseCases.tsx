"use client";

import { RevealWrapper } from 'next-reveal';
import { useMode } from "@/lib/mode-context";

const freeCases = [
  {
    number: "01",
    title: "Voice clone scam",
    desc: "A fraudster synthesises a CEO's voice and calls the finance team demanding an urgent transfer. The voice sounds identical. CatchAm flags the audio as synthetic before any money moves.",
    image: "/ai_voice.jpg",
  },
  {
    number: "02",
    title: "Face swap propaganda",
    desc: "A politician's face is swapped onto a compromising video and circulated hours before an election. CatchAm detects the facial boundary anomalies and confirms manipulation.",
    image: "/face_swap.jpg",
  },
  {
    number: "03",
    title: "Viral fake evidence",
    desc: "A fabricated video of a bank official approving a fraudulent transaction goes viral. The bank's reputation is on the line. CatchAm verifies the footage is AI-generated within seconds.",
    image: "/fakenews.jpg",
  },
];

const proCases = [
  {
    number: "01",
    title: "Executive Impersonation",
    desc: "A high-fidelity clone of your CEO's voice is synthesized to authorize fraudulent transfers. CatchAm intercepts and flags the mathematical anomalies before any funds leave your accounts.",
    image: "/executive_voice.jpg",
  },
  {
    number: "02",
    title: "Brand Defamation",
    desc: "A fabricated video of a company official goes viral on Nigerian blogs. Our proactive 24/7 crawler detects the synthetic media before it hits mainstream news, allowing instant PR response.",
    image: "/brand_crisis.jpg",
  },
  {
    number: "03",
    title: "Onboarding Identity Forgery",
    desc: "A bad actor attempts to bypass KYC and liveness checks using a perfectly morphed face swap. CatchAm's API flags the synthetic manipulation at the point of entry.",
    image: "/kyc_fraud.jpg",
  },
];

export default function UseCases() {
  const { mode } = useMode();
  const cases = mode === "free" ? freeCases : proCases;

  return (
    <section className="px-4 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <RevealWrapper origin="bottom" delay={100} duration={800} distance="40px">
          <div className="mb-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
              {mode === "free" ? "Real Threats" : "Enterprise Defense"}
            </p>
            <h2 className="mt-3 text-3xl font-normal text-[#ffffff] sm:text-4xl">
              {mode === "free" ? "Deepfake fraud is already here" : "Protecting what matters most"}
            </h2>
          </div>
        </RevealWrapper>

        <div className="space-y-24">
          {cases.map((c, i) => (
            <RevealWrapper 
              key={c.number} 
              origin={i % 2 === 0 ? "left" : "right"} 
              delay={200} 
              duration={800} 
              distance="40px"
            >
              <div
                className={`flex flex-col items-center gap-10 lg:gap-20 ${i === 1 ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className={`max-w-lg ${i === 1 ? "lg:ml-auto" : "lg:mr-auto"}`}>
                    <span className="font-mono text-sm font-bold text-[#00d992]/40">
                      {c.number}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold text-[#ffffff] sm:text-3xl">
                      {c.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-[#a0a0a0] sm:text-lg">
                      {c.desc}
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-auto w-full max-w-md rounded-2xl object-cover shadow-2xl"
                  />
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
