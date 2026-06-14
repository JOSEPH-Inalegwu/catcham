import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tiers = [
  {
    name: "Starter",
    price: "75,000",
    description: "For small brands and individual public figures.",
    features: [
      "24/7 web and blog crawling",
      "Real-time escalation alerts",
      "Monthly forensic report allocation",
      "Basic dashboard access",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "150,000",
    description: "For mid-size enterprises with active media exposure.",
    features: [
      "Everything in Starter",
      "Priority crawl scheduling",
      "Extended forensic report allocation",
      "Team access controls",
      "Monthly analytics summary",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "250,000",
    description: "For large corporations, banks, and political figures.",
    features: [
      "Everything in Professional",
      "Dedicated crawling infrastructure",
      "Unlimited forensic reports",
      "API access for security integrations",
      "Dedicated account manager",
      "Custom alert rules",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const included = [
  {
    title: "24/7 Web Crawling",
    description:
      "Continuous monitoring of Nigerian news portals, regional blogs, public forums, and open web directories for unverified media matching your registered profile.",
  },
  {
    title: "Real-Time Alerts",
    description:
      "When flagged content surfaces, CatchAm delivers an emergency notification directly to your security and PR teams within minutes.",
  },
  {
    title: "Forensic Reports",
    description:
      "Every flagged item generates a downloadable forensic report with red indicator bounding boxes drawn around anomalous regions. Court-ready evidence without an engineering review.",
  },
];

export default function EnterprisePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="relative overflow-hidden px-6 py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,168,68,0.08)_0%,_transparent_70%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full border border-border bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
              For enterprises
            </div>
            <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Protect your brand
              <br />
              <span className="text-primary">before it spreads.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              CatchAm continuously monitors Nigerian digital spaces for
              unverified media matching your profile. When a deepfake surfaces,
              your security team knows within minutes, not days.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Create Enterprise Account
            </Link>
          </div>
        </section>

        <section className="border-t border-border-light px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-2xl font-semibold leading-tight md:text-3xl">
                What is included.
              </h2>
              <p className="mx-auto max-w-xl text-text-secondary">
                Every enterprise plan includes the full monitoring pipeline.
                Tiers differ in scale, priority, and support.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {included.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-surface p-8"
                >
                  <h3 className="mb-3 text-lg font-medium text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border-light px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-2xl font-semibold leading-tight md:text-3xl">
                Choose your tier.
              </h2>
              <p className="mx-auto max-w-xl text-text-secondary">
                Scale your protection to match your exposure. All tiers
                include the full detection pipeline.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex flex-col rounded-2xl border p-8 ${
                    tier.highlighted
                      ? "border-primary bg-surface"
                      : "border-border bg-surface"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="mb-4 inline-block self-start rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                      Most popular
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-text-primary">
                    {tier.name}
                  </h3>
                  <div className="mt-3 mb-2">
                    <span className="text-sm text-text-secondary">NGN</span>{" "}
                    <span className="text-3xl font-semibold text-text-primary">
                      {tier.price}
                    </span>{" "}
                    <span className="text-sm text-text-secondary">/ month</span>
                  </div>
                  <p className="mb-6 text-sm text-text-secondary">
                    {tier.description}
                  </p>
                  <ul className="mb-8 flex flex-1 flex-col gap-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/signup"
                    className={`inline-flex h-12 items-center justify-center rounded-full text-sm font-medium transition-opacity hover:opacity-90 ${
                      tier.highlighted
                        ? "bg-primary text-white"
                        : "border border-primary/50 text-text-primary hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border-light px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-2xl font-semibold leading-tight md:text-3xl">
              Not ready to commit?
            </h2>
            <p className="mb-10 text-text-secondary leading-relaxed">
              Try the public scanner first. Upload any suspicious file or paste
              a link. No login required, no charge for basic results.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/scan"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Try the Scanner
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full border border-primary/50 px-8 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
