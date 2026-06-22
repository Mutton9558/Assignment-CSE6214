import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: [process.env.LocalAddress, process.env.VPNAddress],
}

export default nextConfig;
