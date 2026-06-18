"use client";

import Link from "next/link";
import { RevealWrapper } from 'next-reveal';
import GridBackground from "@/components/GridBackground";
import FreeHero from "@/components/FreeHero";
import ProHero from "@/components/ProHero";
import UseCases from "@/components/UseCases";
import Features from "@/components/Features";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import EnterpriseTarget from "@/components/EnterpriseTarget";
import EnterprisePricing from "@/components/EnterprisePricing";
import ExplainableAI from "@/components/ExplainableAI";
import ExpertEscalation from "@/components/ExpertEscalation";
import { useMode } from "@/lib/mode-context";

export default function Home() {
  const { mode } = useMode();

  return (
    <main>
      <GridBackground>
        {mode === "free" ? <FreeHero /> : <ProHero />}
      </GridBackground>

      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <RevealWrapper origin="bottom" delay={100} duration={800} distance="40px">
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
                {mode === "free" ? "How It Works" : "Defence Protocol"}
              </p>
              <h2 className="mt-2 text-2xl font-normal text-[#ffffff] sm:text-3xl">
                {mode === "free" ? "Three steps to verify any file" : "Four-step automated security"}
              </h2>
            </div>
          </RevealWrapper>
          <div className={`grid gap-4 sm:gap-6 ${mode === 'free' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
            {(mode === "free" ? [
              {
                step: "01",
                title: "Upload a file",
                desc: "Drag and drop or select a video, image, or audio file. No account needed."
              },
              {
                step: "02",
                title: "AI analysis",
                desc: "Our engine checks for synthetic manipulation across visual, audio, and deepfake vectors."
              },
              {
                step: "03",
                title: "Get your verdict",
                desc: "Instant on-screen authenticity rating with confidence scores and generative model attribution."
              }
            ] : [
              {
                step: "01",
                title: "Onboarding",
                desc: "Upload verified baseline media to build an encrypted digital profile unique to your identity."
              },
              {
                step: "02",
                title: "Proactive Crawling",
                desc: "Our engines continuously monitor Nigerian news portals, blogs, and public forums 24/7."
              },
              {
                step: "03",
                title: "Algorithmic Analysis",
                desc: "Suspicious media is instantly processed through XceptionNet and AASIST fingerprinting."
              },
              {
                step: "04",
                title: "Instant Escalation",
                desc: "If fraud is confirmed, emergency notifications and forensic reports are delivered directly to your team."
              }
            ]).map((item, i) => (
              <RevealWrapper
                key={item.step}
                origin="bottom"
                delay={150 + (i * 100)}
                duration={800}
                distance="30px"
                className="h-full"
              >
                <div className="h-full rounded-[8px] border border-[#3d3a39] p-6">
                  <span className="font-mono text-2xl font-bold text-[#00d992]/40">{item.step}</span>
                  <h3 className="mt-3 text-base font-semibold text-[#ffffff]">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#a0a0a0]">
                    {item.desc}
                  </p>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {mode === "pro" && <EnterpriseTarget />}
      <UseCases />
      {mode === "pro" && <ExplainableAI />}
      {mode === "pro" && <ExpertEscalation />}
      <Features />
      {mode === "pro" && <EnterprisePricing />}
      <CtaBanner />
      <Footer />
    </main>
  );
}
