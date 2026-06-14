export default function ProblemSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold leading-tight md:text-3xl lg:text-4xl">
            They sound exactly like someone you trust.
            <br />
            <span className="text-primary">That is the point.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-text-secondary leading-relaxed">
            When a fraudster clones your CEO&apos;s voice or your child&apos;s
            voice and sends an urgent request, the banking system sees a
            legitimate transaction. The victim authenticates willingly. Nobody
            flags it.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "AI Voice Clones",
              description:
                "Synthetic voices indistinguishable from the real person. Trained from seconds of audio scraped from social media or phone calls.",
            },
            {
              title: "Deepfake Videos",
              description:
                "Fabricated video footage spreading through WhatsApp and social media. Used to blackmail, defraud, and destroy reputations.",
            },
            {
              title: "The Gap Nobody Covers",
              description:
                "Traditional cybersecurity blocks unauthorised access. It cannot detect an authorised user being manipulated by a synthetic clone.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glow-border rounded-2xl border border-border-light bg-surface p-6 transition-all duration-300 hover:glow-border-hover md:p-8"
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
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-border bg-primary-light/20 px-6 py-8 md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(0,168,68,0.06)_0%,_transparent_70%)]" />
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-10">
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                Traditional security
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">
                Blocks unauthorised access. If a criminal steals your password or
                breaks into your account, the system stops them.
              </p>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                What it misses
              </div>
              <p className="text-sm leading-relaxed text-text-primary">
                When someone clones your voice and convinces <em>you</em> to
                authorise the transaction, the system sees a legitimate user.
                The account is not breached. The person is.
              </p>
            </div>
          </div>
          <div className="relative mt-6 border-t border-border pt-6 text-center">
            <p className="text-sm font-medium text-primary">
              OPay stops unauthorised access. CatchAm stops authorised
              manipulation. The two are complementary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
