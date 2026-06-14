import Link from "next/link";

export default function CTASection() {
  return (
    <section className="border-t border-border-light px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
          Built for what is
          <br />
          <span className="text-primary">already happening.</span>
        </h2>
        <p className="mb-10 text-text-secondary leading-relaxed">
          Somewhere in Nigeria right now, someone is about to receive a voice
          note that sounds exactly like their child, their boss, or their
          pastor. CatchAm exists to be the moment of pause before that happens.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
            Enterprise Access →
          </Link>
        </div>
      </div>
    </section>
  );
}
