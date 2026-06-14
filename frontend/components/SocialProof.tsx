export default function SocialProof() {
  return (
    <section className="border-y border-border-light bg-surface px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-8 text-center text-sm text-text-muted">
          Protecting enterprises and individuals across Nigeria
        </p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary md:text-3xl">
              99.2%
            </div>
            <div className="mt-1 text-xs text-text-muted">
              Detection accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary md:text-3xl">
              &lt; 30s
            </div>
            <div className="mt-1 text-xs text-text-muted">
              Average scan time
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary md:text-3xl">
              24/7
            </div>
            <div className="mt-1 text-xs text-text-muted">
              Enterprise monitoring
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary md:text-3xl">
              3 Models
            </div>
            <div className="mt-1 text-xs text-text-muted">
              Multimodal detection
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
