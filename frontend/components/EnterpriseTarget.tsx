"use client";

import { RevealWrapper } from 'next-reveal';

const targets = [
  {
    title: "Starter",
    audience: "Small Brands & Public Figures",
    desc: "Protect your personal brand, social media presence, and public image from targeted deepfake harassment and voice cloning.",
  },
  {
    title: "Professional",
    audience: "Mid-size Enterprises",
    desc: "Secure your executive communications and corporate reputation against sophisticated impersonation and financial authorization fraud.",
  },
  {
    title: "Enterprise",
    audience: "Large Corporations & Banks",
    desc: "Deploy comprehensive, organization-wide digital profile monitoring to shield institutional integrity at an industrial scale.",
  },
];

export default function EnterpriseTarget() {
  return (
    <section id="enterprise-target" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <RevealWrapper origin="bottom" delay={100} duration={800} distance="40px">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
              Who It Is For
            </p>
            <h2 className="mt-2 text-2xl font-normal text-[#ffffff] sm:text-3xl">
              Scalable protection for every level
            </h2>
          </div>
        </RevealWrapper>

        <div className="grid gap-6 sm:grid-cols-3">
          {targets.map((t, i) => (
            <RevealWrapper
              key={t.title}
              origin="bottom"
              delay={150 + i * 100}
              duration={800}
              distance="30px"
              className="h-full"
            >
              <div className="flex h-full flex-col rounded-[8px] border border-[#3d3a39] bg-[#141414] p-8 transition-colors hover:border-[#00d992]/30">
                <div className="mb-6 inline-flex self-start rounded-[4px] bg-[#00d992]/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#00d992]">
                  {t.title}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-[#ffffff]">
                  {t.audience}
                </h3>
                <p className="text-sm leading-relaxed text-[#a0a0a0]">
                  {t.desc}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
