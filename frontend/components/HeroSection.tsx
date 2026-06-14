import Link from "next/link";

function ScannerMockup() {
  return (
    <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border-light px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-3 text-xs text-text-muted">CatchAm Scanner</span>
      </div>
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-text-primary">CEO_voice_note_final.mp3</div>
            <div className="text-xs text-text-muted">2.4 MB &middot; Audio</div>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Analysing...
            </span>
          </div>
        </div>

        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-bg-primary">
          <div className="h-full w-[72%] rounded-full bg-primary transition-all" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-bg-primary p-4">
            <div className="mb-2 text-xs text-text-muted">XceptionNet</div>
            <div className="text-sm font-medium text-text-primary">Video Frames</div>
            <div className="mt-1 text-xs text-primary">Scanning...</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-primary p-4">
            <div className="mb-2 text-xs text-text-muted">AASIST</div>
            <div className="text-sm font-medium text-text-primary">Audio Frequency</div>
            <div className="mt-1 text-xs text-primary">Scanning...</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-primary p-4">
            <div className="mb-2 text-xs text-text-muted">RetinaFace</div>
            <div className="text-sm font-medium text-text-primary">Face Mapping</div>
            <div className="mt-1 text-xs text-text-muted">Queued</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,168,68,0.06)_0%,_transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Detect deepfakes
          <br />
          <span className="text-primary">before they detect you.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
          AI voice clones and deepfake videos target Nigerians every day.
          Scan a file instantly, get forensic evidence, or protect your brand
          around the clock.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/scan"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Scan a File
          </Link>
          <Link
            href="/enterprise"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            For Enterprise →
          </Link>
        </div>
      </div>
      <ScannerMockup />
    </section>
  );
}
