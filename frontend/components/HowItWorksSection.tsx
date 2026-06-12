export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload or paste",
      description:
        "Drag and drop a video or audio file, or paste a public link. No account needed.",
    },
    {
      number: "02",
      title: "AI analysis",
      description:
        "XceptionNet analyses video frames. AASIST analyses audio frequencies. RetinaFace maps facial regions for anomalies.",
    },
    {
      number: "03",
      title: "Clear result",
      description:
        "Real or synthetic. A confidence score and a forensic report with red indicator bounding boxes around anomalies.",
    },
  ];

  return (
    <section className="border-t border-border-light px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold leading-tight md:text-3xl lg:text-4xl">
            Three steps.
            <br />
            <span className="text-primary">One answer.</span>
          </h2>
          <p className="mx-auto max-w-xl text-text-secondary leading-relaxed">
            No technical knowledge required. If you can drag a file or copy a
            link, you can verify any media.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="glow-border rounded-2xl border border-border-light bg-surface p-6 md:p-8"
            >
              <span className="mb-4 block text-3xl font-semibold text-primary/40">
                {step.number}
              </span>
              <h3 className="mb-3 text-lg font-medium text-text-primary">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
