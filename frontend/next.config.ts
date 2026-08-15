import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
  serverExternalPackages: ["sharp"],
};

export default withSentryConfig(nextConfig);
