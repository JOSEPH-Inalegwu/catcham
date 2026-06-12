import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href="/" className="mb-6 text-lg font-semibold tracking-tight text-text-primary">
        Catch<span className="text-primary">Am</span>
      </Link>
      <h1 className="mb-3 text-2xl font-semibold">Enterprise Dashboard</h1>
      <p className="mb-8 text-sm text-text-muted">
        Enterprise monitoring and alert management — coming soon.
      </p>
      <Link
        href="/scan"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Try the Scanner
      </Link>
    </div>
  );
}
