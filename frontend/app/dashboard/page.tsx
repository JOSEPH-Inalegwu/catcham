export default function DashboardPage() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-2xl font-normal tracking-[-0.6px] text-[#ffffff] sm:text-3xl lg:text-4xl">
          Dashboard
        </h1>
        <p className="mt-3 text-sm text-[#8b949e] sm:text-base">
          Monitor your alerts, crawl activity, and report history.
        </p>
      </div>
    </main>
  );
}
