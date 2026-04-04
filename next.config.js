/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  ...(process.env.NODE_ENV === "development"
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                {
                  key: "Cross-Origin-Opener-Policy",
                  value: "same-origin",
                },
                {
                  key: "Cross-Origin-Embedder-Policy",
                  value: "require-corp",
                },
              ],
            },
          ]
        },
      }
    : {}),
}

module.exports = nextConfig
