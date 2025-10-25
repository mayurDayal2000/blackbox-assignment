import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    browserDebugInfoInTerminal: true,
  },

  async headers() {
    return [
      {
        headers: [
          //  Force HTTPS + hide server fingerprint
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // Click-jacking defence
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          //  MIME-sniff off
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Referrer leakage
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Permissions-Policy (feature policy)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },

          // Content-Security-Policy
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "img-src 'self' data: https:; " +
              "connect-src 'self' " +
              "ws://localhost:3000 " + // For local development
              "worker-src 'self' blob:; " +
              "frame-ancestors 'none';",
          },
        ],
        // apply to every route
        source: "/(.*)",
      },
    ];
  },
  poweredByHeader: false,
};

export default nextConfig;
