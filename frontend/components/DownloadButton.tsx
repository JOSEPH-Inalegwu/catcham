"use client";

export default function DownloadButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      Download report
    </button>
  );
}
