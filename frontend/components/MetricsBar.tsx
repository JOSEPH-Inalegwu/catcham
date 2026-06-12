export default function MetricsBar() {
  const metrics = [
    { value: "99.2%", label: "Detection Accuracy" },
    { value: "10,000+", label: "Files Analysed" },
    { value: "< 30s", label: "Average Scan Time" },
    { value: "24/7", label: "Enterprise Monitoring" },
  ];

  return (
    <section className="border-y border-border-light bg-surface px-6 py-14 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-2xl font-semibold text-primary md:text-3xl">
                {m.value}
              </div>
              <div className="mt-1.5 text-xs text-text-muted md:text-sm">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
