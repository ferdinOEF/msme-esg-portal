/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don’t fail production builds on TS/ESLint issues
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}
export default nextConfig
