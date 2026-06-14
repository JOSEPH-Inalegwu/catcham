import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const included = [
  "10 detailed forensic reports",
  "Red bounding box overlays on anomalous regions",
  "Confidence score and anomaly classification",
  "Downloadable PDF evidence reports",
  "No subscription required, pay once and use",
];

export default function ProPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="relative overflow-hidden px-6 py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,168,68,0.08)_0%,_transparent_70%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full border border-border bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
              For individuals and small teams
            </div>
            <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Pro Scan
              <span className="text-primary"> Credits</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              Get full forensic reports with visual evidence. One purchase,
              no subscription. Use them whenever you need them.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="/scan"
                className="inline-flex h-12 items-center justify-center rounded-full border border-primary/50 px-8 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
              >
                Try Free First
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border-light px-6 py-24 md:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-8">
                <div className="mb-4 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                  Free tier
                </div>
                <h3 className="mb-2 text-xl font-medium text-text-primary">
                  Basic Scan
                </h3>
                <div className="mb-1">
                  <span className="text-3xl font-semibold text-text-primary">
                    Free
                  </span>
                </div>
                <p className="mb-6 text-sm text-text-secondary">
                  3 scans per day, no account required
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
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
                    Real or synthetic verdict
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
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
                    Confidence score
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    No visual forensic report
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    No downloadable report
                  </li>
                </ul>
                <Link
                  href="/scan"
                  className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-text-primary"
                >
                  Try It Now
                </Link>
              </div>

              <div className="relative rounded-2xl border border-primary bg-surface p-8">
                <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                  Best value
                </div>
                <div className="mb-4 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                  Pro
                </div>
                <h3 className="mb-2 text-xl font-medium text-text-primary">
                  Scan Credits
                </h3>
                <div className="mb-1">
                  <span className="text-3xl font-semibold text-text-primary">
                    NGN 8,000
                  </span>
                </div>
                <p className="mb-6 text-sm text-text-secondary">
                  10 forensic reports, no expiry
                </p>
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li
                      key={item}
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
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Buy Credits
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border-light px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-2xl font-semibold leading-tight md:text-3xl">
              Need continuous monitoring?
            </h2>
            <p className="mb-10 text-text-secondary leading-relaxed">
              If your brand or organisation needs 24/7 crawling, real-time
              alerts, and team access, the enterprise plan covers everything.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/enterprise"
                className="inline-flex h-12 items-center justify-center rounded-full border border-primary/50 px-8 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
              >
                View Enterprise Plans
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
