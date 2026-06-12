const faqs = [
  {
    q: "What types of files can I scan?",
    a: "Video files (MP4, AVI, MOV) and audio files (MP3, WAV, M4A). If you have a public link instead of a file, paste the URL and we will fetch it.",
  },
  {
    q: "Do I need an account to scan a file?",
    a: "No. The public scanner is free and requires no login. Upload or paste a link and get your result immediately.",
  },
  {
    q: "How long does the analysis take?",
    a: "Most files are analysed in under 30 seconds. Processing time depends on file size and length.",
  },
  {
    q: "How does CatchAm detect synthetic media?",
    a: "Three models work together. XceptionNet analyses video frames for artefacts. AASIST examines audio frequencies for synthetic signatures. RetinaFace maps facial regions to detect unnatural warping or lip-sync tearing.",
  },
  {
    q: "What happens if fraud is detected?",
    a: "You receive a clear result with a confidence score and a downloadable forensic report. The report shows red indicator bounding boxes around anomalous regions so anyone can identify the manipulation at a glance.",
  },
  {
    q: "Is my file stored or shared after scanning?",
    a: "Files are processed in memory and not permanently stored. Results and reports are generated for your download and are not shared with third parties.",
  },
];

export default function FAQSection() {
  return (
    <section className="border-t border-border-light px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold leading-tight md:text-3xl lg:text-4xl">
            Questions?
            <br />
            <span className="text-primary">We have answers.</span>
          </h2>
        </div>
        <div className="grid gap-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="glow-border group rounded-2xl border border-border-light bg-surface transition-all duration-200 open:glow-border-hover"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium text-text-primary md:px-8">
                {item.q}
                <span className="ml-4 text-xs text-primary transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-text-secondary md:px-8">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
