"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "@/lib/posthog";

function PageViewTracker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    posthog.capture("$pageview", { path: url });
  }, [pathname, searchParams]);

  return <>{children}</>;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PageViewTracker>{children}</PageViewTracker>
    </Suspense>
  );
}
