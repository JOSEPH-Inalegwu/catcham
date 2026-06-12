import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,230,118,0.08)_0%,_transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Your shield against
          <br />
          <span className="text-primary text-glow">synthetic identity fraud</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
          AI voice clones and deepfake videos target Nigerians every day.
          Upload a suspicious file or paste a link. CatchAm tells you if it is
          real or synthetic before you act.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/scan"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Scan a File
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-full border border-primary/50 px-8 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
          >
            For Enterprise
          </Link>
        </div>
      </div>

    </section>
  );
}
