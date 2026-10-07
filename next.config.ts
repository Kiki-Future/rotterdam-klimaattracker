import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The bare address goes to the English site. Change "/en" to "/nl"
  // to make Dutch the default.
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
  // The Dutch "How it's checked" page gets a Dutch web address, but is
  // served by the same page file as the English one.
  async rewrites() {
    return [{ source: "/nl/hoe-het-gecontroleerd-is", destination: "/nl/how-its-checked" }];
  },
};

export default nextConfig;
