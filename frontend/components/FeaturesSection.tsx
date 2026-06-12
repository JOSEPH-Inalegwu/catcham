import Link from "next/link";

export default function FeaturesSection() {
  return (
    <section className="border-t border-border-light px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold leading-tight md:text-3xl lg:text-4xl">
            Two layers.
            <br />
            <span className="text-primary">Complete coverage.</span>
          </h2>
        </div>
        <div className="mb-16 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-primary-light">
              <span className="text-sm font-semibold text-primary">01</span>
            </div>
            <div className="mb-3 inline-block rounded-full border border-border bg-primary-light px-3 py-1 text-xs font-medium text-primary">
              For everyone
            </div>
            <h3 className="mb-3 text-xl font-medium text-text-primary">
              Public Scanner
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              No login required. Upload any video or audio file, or paste a
              public link. CatchAm processes it instantly using XceptionNet,
              AASIST, and RetinaFace models, and returns a clear real or
              synthetic result with a downloadable forensic report.
            </p>
            <Link
              href="/scan"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Try the Scanner
            </Link>
          </div>
          <div>
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-primary-light">
              <span className="text-sm font-semibold text-primary">02</span>
            </div>
            <div className="mb-3 inline-block rounded-full border border-border bg-primary-light px-3 py-1 text-xs font-medium text-primary">
              For enterprises
            </div>
            <h3 className="mb-3 text-xl font-medium text-text-primary">
              Proactive Monitoring
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              Continuous crawling of Nigerian digital spaces for media matching
              your profile. Real-time alerts when flagged content surfaces.
              Full forensic report history, account management, and team access
              controls.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full border border-primary/50 px-6 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
