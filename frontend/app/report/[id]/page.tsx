import Link from "next/link";
import { getReport } from "@/lib/api";
import ReportView from "@/components/ReportView";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getReport(id);

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="mb-4 text-sm text-text-muted">Report not found.</p>
        <Link href="/scan" className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white">
          Scan a file
        </Link>
      </div>
    );
  }

  return <ReportView id={id} fallback={result} />;
}
