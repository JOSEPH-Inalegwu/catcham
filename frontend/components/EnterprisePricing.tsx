"use client";

import { RevealWrapper } from 'next-reveal';
import Link from 'next/link';

const includedFeatures = [
  "24/7 public web and blog crawling",
  "Real-time escalation alerts",
  "Face profile registration",
  "Digital profile creation",
];

const tiers = [
  {
    name: "Starter",
    price: "75,000",
    period: "NGN / month",
    popular: false,
    features: [
      "Up to 5 Digital Profiles",
      "10 Forensic Reports / month",
      "Standard API Access",
      "Email Support",
    ]
  },
  {
    name: "Professional",
    price: "150,000",
    period: "NGN / month",
    popular: true,
    features: [
      "Up to 15 Digital Profiles",
      "30 Forensic Reports / month",
      "Advanced API Access",
      "Real-time Webhook Callbacks",
      "Priority Support (Email & Chat)",
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Tailored to your needs",
    isCustom: true,
    popular: false,
    features: [
      "Unlimited Digital Profiles",
      "100+ Forensic Reports / month",
      "Unlimited API Access",
      "Custom Model Training",
      "Dedicated Account Manager",
    ]
  },
];

export default function EnterprisePricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <RevealWrapper origin="bottom" delay={100} duration={800} distance="40px">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
              Pricing
            </p>
            <h2 className="mt-2 text-3xl font-normal text-[#ffffff] sm:text-4xl">
              Transparent, predictable protection
            </h2>
          </div>
        </RevealWrapper>

        <RevealWrapper origin="bottom" delay={200} duration={800} distance="30px">
          <div className="w-full mb-16 rounded-2xl border border-[#3d3a39] bg-[#141414] p-8 text-center sm:p-10 shadow-2xl">
            <h3 className="mb-6 text-lg font-semibold text-[#ffffff]">
              Included in every subscription plan
            </h3>
            <div className="flex flex-wrap justify-center gap-y-4 gap-x-6 sm:gap-x-8">
              {includedFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00d992]/20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#bdbdbd]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealWrapper>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <RevealWrapper key={tier.name} origin="bottom" delay={200 + i * 100} duration={800} distance="30px" className="h-full">
              <div className={`relative flex h-full flex-col rounded-2xl border ${tier.popular ? 'border-[#00d992]' : 'border-[#3d3a39]'} bg-[#141414] p-8 shadow-2xl`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#00d992] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#101010] shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-[#ffffff]">{tier.name}</h3>
                <div className="my-6">
                  {tier.isCustom ? (
                    <span className="text-4xl font-bold tracking-tight text-[#ffffff]">Custom</span>
                  ) : (
                    <span className="text-4xl font-bold tracking-tight text-[#ffffff]">₦{tier.price}</span>
                  )}
                  <span className="ml-2 text-sm font-medium text-[#a0a0a0]">{tier.period}</span>
                </div>
                
                <ul className="mb-8 flex flex-col gap-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm text-[#bdbdbd]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className={`mt-auto flex w-full items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${tier.popular ? 'bg-[#00d992] text-[#101010] hover:opacity-90' : 'bg-[#1e1e1e] text-[#ffffff] hover:bg-[#2a2a2a]'}`}
                >
                  {tier.isCustom ? "Contact Sales" : "Select Plan"}
                </Link>
              </div>
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper origin="bottom" delay={500} duration={800} distance="30px">
          <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-[#00d992]/30 bg-[#00d992]/5 p-8 shadow-2xl sm:p-10 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#00d992]/10 blur-[80px]"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-between gap-10 lg:flex-row lg:items-start">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex rounded-[4px] bg-[#00d992]/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#00d992] mb-4">
                  No Commitment
                </div>
                <h3 className="text-2xl font-semibold text-[#ffffff]">Pay-as-you-go Report Buckets</h3>
                <p className="mt-3 text-sm text-[#a0a0a0] max-w-md mx-auto lg:mx-0">
                  Don't need 24/7 crawling? Purchase forensic reports on demand. Get the full depth of our enterprise analysis engine exactly when you need it.
                </p>
                <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                  {[
                    "Non-expiring credits",
                    "Full PDF forensic analysis",
                    "Manual file scanning",
                    "No subscription required"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 w-full sm:w-[45%]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d992" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm text-[#bdbdbd]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#141414] border border-[#3d3a39] p-8 w-full max-w-sm shrink-0 shadow-lg">
                <span className="text-5xl font-bold tracking-tight text-[#ffffff]">₦8,000</span>
                <span className="mt-2 text-sm font-medium text-[#a0a0a0]">for 10 forensic reports</span>
                <Link
                  href="/auth/signup"
                  className="mt-8 w-full rounded-lg bg-[#00d992] px-6 py-3 text-center text-sm font-semibold text-[#101010] transition-opacity hover:opacity-90 shadow-xl"
                >
                  Buy a Bucket
                </Link>
                <p className="mt-4 text-xs text-[#666666]">
                  Credits never expire. Use them anytime.
                </p>
              </div>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
