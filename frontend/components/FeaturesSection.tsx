import Link from "next/link";

function ScannerResultMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border-light px-5 py-3">
        <div className="text-xs text-text-muted">Scan Result</div>
      </div>
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-red-400">Synthetic content detected</div>
            <div className="text-xs text-text-muted">Confidence: 94%</div>
          </div>
        </div>
        <div className="rounded-xl bg-bg-primary p-4">
          <div className="mb-2 text-xs text-text-muted">Anomaly</div>
          <div className="text-sm text-text-primary">Lip-sync tearing detected</div>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs text-red-400">High confidence</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">Download report</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border-light px-5 py-3">
        <div className="text-xs text-text-muted">Enterprise Dashboard</div>
      </div>
      <div className="p-5">
        <div className="mb-4 space-y-3">
          <div className="flex items-start gap-3 rounded-xl bg-red-500/5 p-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
            <div>
              <div className="text-sm font-medium text-text-primary">Flagged: Channels TV clip</div>
              <div className="text-xs text-text-muted">Deepfake detected &middot; 2 min ago</div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-bg-primary p-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
            <div>
              <div className="text-sm font-medium text-text-primary">Alert: Vanguard blog post</div>
              <div className="text-xs text-text-muted">Under review &middot; 18 min ago</div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-bg-primary p-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <div className="text-sm font-medium text-text-primary">Crawl complete: 14 sources scanned</div>
              <div className="text-xs text-text-muted">No new threats &middot; 1 hr ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForensicReportMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border-light px-5 py-3">
        <div className="text-xs text-text-muted">Forensic Report</div>
      </div>
      <div className="p-5">
        <div className="mb-4 rounded-xl bg-bg-primary p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-text-muted">Frame analysis</span>
            <span className="text-xs text-primary">RPT-8K4F-2026</span>
          </div>
          <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-surface-light">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-text-muted">Video frame</div>
            </div>
            <div className="absolute left-[15%] top-[20%] h-[35%] w-[40%] rounded border-2 border-red-500/70">
              <div className="absolute -top-5 left-0 rounded bg-red-500/80 px-1.5 py-0.5 text-[10px] text-white">
                Anomalous region
              </div>
            </div>
            <div className="absolute bottom-2 right-2 rounded bg-bg-primary/80 px-2 py-1 text-[10px] text-primary">
              Frame 142 / 300
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span>Verdict: <span className="text-red-400">Synthetic</span></span>
            <span>Confidence: <span className="text-text-primary">94%</span></span>
            <span>Anomalies: <span className="text-text-primary">2</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            One platform.
            <br />
            <span className="text-primary">Every layer of defence.</span>
          </h2>
        </div>

        <div className="mb-24 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">
              01 &mdash; Public Scanner
            </div>
            <h3 className="mb-4 text-2xl font-semibold text-text-primary">
              Scan any file. Get a clear answer.
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              No login required. Upload a video or audio file, or paste a
              public link. Three AI models analyse it instantly and return a
              clear real or synthetic verdict with a confidence score.
            </p>
            <ul className="mb-8 space-y-2.5">
              {["XceptionNet for video frames", "AASIST for audio frequencies", "RetinaFace for facial mapping"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/scan"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Try the Scanner
            </Link>
          </div>
          <ScannerResultMockup />
        </div>

        <div className="mb-24 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <AlertMockup />
          </div>
          <div className="order-1 lg:order-2">
            <div className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">
              02 &mdash; Enterprise Monitoring
            </div>
            <h3 className="mb-4 text-2xl font-semibold text-text-primary">
              24/7 crawling. Instant alerts.
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              Continuous monitoring of Nigerian news portals, regional blogs,
              and public web directories. When a deepfake surfaces, your
              security team knows within minutes, not days.
            </p>
            <ul className="mb-8 space-y-2.5">
              {["Real-time escalation alerts", "Monthly forensic report allocation", "Team access controls"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/enterprise"
              className="inline-flex h-11 items-center justify-center rounded-full border border-primary/50 px-6 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
            >
              View Enterprise Plans
            </Link>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">
              03 &mdash; Forensic Reports
            </div>
            <h3 className="mb-4 text-2xl font-semibold text-text-primary">
              Evidence anyone can understand.
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              Every flagged item generates a downloadable forensic report with
              red indicator bounding boxes drawn around anomalous regions.
              Court-ready evidence without an engineering review.
            </p>
            <ul className="mb-8 space-y-2.5">
              {["Visual bounding box overlays", "Confidence scores and anomaly types", "Downloadable PDF reports"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/pro"
              className="inline-flex h-11 items-center justify-center rounded-full border border-primary/50 px-6 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
            >
              Get Pro Credits
            </Link>
          </div>
          <ForensicReportMockup />
        </div>
      </div>
    </section>
  );
}
