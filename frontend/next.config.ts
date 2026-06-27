import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  serverExternalPackages: ["sharp"],
};

export default withSentryConfig(nextConfig);
