/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: true,
  compress: true,
  cleanDistDir: true,
  optimizeFonts: true,
  reactStrictMode: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  eslint: {
    /** Only run ESLint on these directories with `next lint` and `next build`. */
    dirs: ["src"],
    /** Do not run ESLint during production builds (`next build`). */
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "https://www.pexels.com/",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 100000,
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        {
          loader: "file-loader",
        },
      ],
    });
    return config;
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
    autoPrerender: true,
  },
};

module.exports = nextConfig;
